import DietPlan from '../model/programmeDietPlanModel.js';
import Programme from '../model/programmeModel.js';

export const createProgrammeDietPlan = async (req, res) => {
  const { days } = req.body; // Extract days from the request body
  const id = req.params.id; // Programme ID from the request parameters

  console.log(days);
  console.log('Type of days:', Array.isArray(days) ? 'Array' : 'Not an Array'); // Debugging output

  try {
    // Find the programme by ID
    const programme = await Programme.findById(id);

    // Check if the programme exists
    if (!programme) {
      return res.status(400).json({ error: 'Programme does not exist' });
    }

    // Validate that days is an array
    if (!Array.isArray(days)) {
      return res.status(400).json({ error: 'Days should be an array' });
    }

    // Create and save the diet plan
    const newDietPlan = new DietPlan({
      days: days.map((day) => ({
        day: day.day,
        meals: day.meals.map((meal) => ({
          time: meal.time,
          meal: meal.meal,
        })),
      })),
      programme: programme._id, // Associate with the programme
    });

    // Save the DietPlan to the database
    await newDietPlan.save();
    console.log(newDietPlan);

    // Send a success response with the created diet plan
    res
      .status(201)
      .json({ message: 'Diet plan created successfully', newDietPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export const updateProgrammeDietPlan = async (req, res) => {
  const { id, planId } = req.params; // Programme ID and Diet Plan ID from the request parameters
  const { days: newDays } = req.body; // Extract the new days from the request body

  try {
    // Find the programme by ID
    const programme = await Programme.findById(id);

    // Check if the programme exists
    if (!programme) {
      return res.status(400).json({ error: 'Programme does not exist' });
    }

    // Validate that newDays is an array
    if (!Array.isArray(newDays)) {
      return res.status(400).json({ error: 'Days should be an array' });
    }

    // Find the existing diet plan
    const existingDietPlan = await DietPlan.findOne({
      _id: planId,
      programme: programme._id,
    });

    if (!existingDietPlan) {
      return res.status(404).json({ message: 'Diet plan not found' });
    }

    // Merge existing days with new days
    const mergedDays = [...existingDietPlan.days];

    newDays.forEach((newDay) => {
      // Check if the day already exists in the existing diet plan
      const existingDayIndex = mergedDays.findIndex(
        (day) => day.day === newDay.day
      );

      if (existingDayIndex > -1) {
        // If the day exists, update the meals for that day
        mergedDays[existingDayIndex].meals = newDay.meals.map((meal) => ({
          time: meal.time,
          meal: meal.meal,
        }));
      } else {
        // If the day doesn't exist, add it as a new day
        mergedDays.push({
          day: newDay.day,
          meals: newDay.meals.map((meal) => ({
            time: meal.time,
            meal: meal.meal,
          })),
        });
      }
    });

    // Update the diet plan with the merged days
    existingDietPlan.days = mergedDays;
    const updatedDietPlan = await existingDietPlan.save();

    // Send success response
    res.status(200).json({
      message: 'Diet plan updated successfully',
      updatedDietPlan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export const deleteProgrammeDietPlan = async (req, res) => {
  const { id, planId } = req.params; // Programme ID and Diet Plan ID from the request parameters

  try {
    const deletedDietPlan = await DietPlan.findOneAndDelete({
      _id: planId,
      programme: id,
    });

    if (!deletedDietPlan) {
      return res.status(404).json({ message: 'Diet plan not found' });
    }

    res.status(200).json({ message: 'Diet plan deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getProgrammeDietPlan = async (req, res) => {
  const id = req.params.id; // Programme ID from the request parameters

  try {
    const dietPlans = await DietPlan.find({ programme: id });

    if (!dietPlans.length) {
      return res
        .status(404)
        .json({ message: 'No diet plans found for this programme' });
    }

    res.status(200).json({ dietPlans });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getSingleProgrammeDietPlan = async (req, res) => {
  const { id, planId } = req.params;

  try {
    const singleDietPlan = await DietPlan.findOne({
      _id: planId,
      programme: id,
    });

    if (!singleDietPlan) {
      return res.status(404).json({ message: 'Diet plan not found' });
    }

    res.status(200).json({ singleDietPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
