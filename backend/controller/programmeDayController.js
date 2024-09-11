import uploadToCloudinary from '../middleware/videoCloudinary.js';
import programmeDayPlanModel from '../model/programmeDayPlanModel.js';
import cloudinary from 'cloudinary';

export const createProgrammeDayPlan = async (req, res) => {
  const { id } = req.params; // Programme ID from the request parameters
  const { days } = req.body; // Array of day plans
  console.log(req.body);

  try {
    if (!Array.isArray(days)) {
      return res.status(400).json({ error: 'Days should be an array' });
    }

    const createdDayPlans = await Promise.all(
      days.map(async (day) => {
        if (!day.day || !day.exercises) {
          throw new Error(
            'Each day object must include day and exercises fields.'
          );
        }

        const exercisesWithVideo = await Promise.all(
          day.exercises.map(async (exercise) => {
            const { name, sets, reps, video } = exercise;

            let videoUrl = video?.url || null;
            let videoName = video?.name || null;

            // If video is uploaded (i.e., not a URL but a file), upload to Cloudinary
            if (video?.file) {
              try {
                const uploadResult = await cloudinary.uploader.upload(
                  video.file,
                  {
                    resource_type: 'video',
                  }
                );
                videoUrl = uploadResult.secure_url;
                videoName = video.name || uploadResult.original_filename;
              } catch (uploadError) {
                console.error('Video upload failed:', uploadError);
                throw new Error('Failed to upload video');
              }
            }

            return {
              name,
              sets,
              reps,
              videoUrl,
              videoName,
            };
          })
        );

        const newDayPlan = new programmeDayPlanModel({
          day: day.day,
          exercises: exercisesWithVideo,
          programme: id,
        });

        return newDayPlan.save();
      })
    );

    res.status(201).json({
      message: 'Day plans created successfully',
      programmeId: id,
      createdDayPlans,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export const updateProgrammeDayPlan = async (req, res) => {
  const { id } = req.params; // Programme ID
  const { day, exercises, planId } = req.body; // Day ID and the new values

  try {
    if (!planId) {
      return res.status(400).json({ error: 'Plan ID is required' });
    }

    const existingDayPlan = await programmeDayPlanModel.findOne({
      _id: planId,
      programme: id,
    });

    if (!existingDayPlan) {
      return res.status(404).json({ message: 'Day plan not found' });
    }

    // Update fields with provided values while preserving existing ones
    const updatedDayPlan = await programmeDayPlanModel.findOneAndUpdate(
      { _id: planId, programme: id },
      {
        $set: {
          day: day ?? existingDayPlan.day,
          exercises: exercises ?? existingDayPlan.exercises,
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Day plan updated successfully',
      updatedDayPlan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export const deleteProgrammeDayPlan = async (req, res) => {
  const { id, planId } = req.params;

  try {
    const deletedDayPlan = await programmeDayPlanModel.findOneAndDelete({
      _id: planId,
      programme: id,
    });

    if (!deletedDayPlan) {
      return res.status(404).json({ message: 'Day plan not found' });
    }

    res
      .status(200)
      .json({ message: 'Day plan deleted successfully', deletedDayPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export const getProgrammeDayPlan = async (req, res) => {
  const { id } = req.params;

  try {
    const dayPlans = await programmeDayPlanModel.find({ programme: id });

    if (!dayPlans.length) {
      return res
        .status(404)
        .json({ message: 'No day plans found for this programme' });
    }

    res.status(200).json(dayPlans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export const getSingleProgrammeDayPlan = async (req, res) => {
  const { id, planId } = req.params;

  try {
    const dayPlan = await programmeDayPlanModel.findOne({
      _id: planId,
      programme: id,
    });

    if (!dayPlan) {
      return res.status(404).json({ message: 'Day plan not found' });
    }

    res.status(200).json(dayPlan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
