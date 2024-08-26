const DescriptionComponent = () => {
  return (
    <div
      className="min-h-[80vh] bg-gray-900 flex flex-col gap-5 font-outfit relative rounded-[10px] p-5"
      style={{
        backgroundImage: `url('https://s3-alpha-sig.figma.com/img/fb55/b466/b05afb0a4774775c1b269cd0567431cd?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=k2kKnQWDVaXS2KNjmIuXcspoOwqvjRU0TVK232dlgoBtFMW0Ofrw4lcJKMzLCZNYmG3WL~O6lbOkgJzhPfhEWq3fhj4giSAjOsC4w4ycNxInm7NrJEznDq9-xsy1sN2BcBqvUSFEYaVkRIzdHEh1qJOGsInAuSXcpwBSXHGnESfEUrrdaR0uP4zQmqmGqwgZ7z9Uijpbudfyyivqo7e8jvKRhYhm2UGFQg-qXcJax2LJxETUPE6gAHjt3GhiNK39D~Lw1AEUS~bCIbWdOSVYAA6wNhBTlKh3JwoXPVGtlvjs9PS0QLXvLIBgL9ASEfiv3fJ9l3icHusqaZFCHNzAFg__')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h1 className="text-white text-[2rem] sm:text-[3rem] text-center hover:underline-offset-1 hover:underline hover:decoration-orange-500 transition-all ">
        Fit for your Lifestyle
      </h1>
      <p className="text-[1rem] sm:text-[1.5rem] text-white text-auto w-[95%] m-auto hover:underline-offset-1 hover:underline ">
        Wake up with a sunrise meditation, sweat it out with lunchtime HIIT, or
        unwind with an evening flow. You’ll find movement for every mood with
        classes sorted by time, style, and skill level. Discover new challenges
        and push your limits with our curated programs, or take it slow with
        gentle stretches and restorative yoga. Join our vibrant community and
        start your journey to a healthier, happier you today.
      </p>
      <div className=" flex justify-center items-center hover:animate-shake">
        <img
          src="https://s3-alpha-sig.figma.com/img/ca18/10e4/d6848140e07ec237e6e69c53e97c5f21?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=VodsFT9wB4r0Il8f0KJNjCwijwOLHOZ6wO2BhFZFBZ~9g6AX8wYQTxwlOsRKDNieAtGFkKrBdxLObKfvd3P4kVxdqX6PQA-jQRf0Mr~lHwCAUQoJrQVQ7aM~H7PNwVXxbl6LXZ5jwfY6xSV1dO65AAGRruQxNLhTqIH8KlXJXoVKyIJkKt-WuGp6eZUjbyO1bJ17cajGJpuzHCGKajANAcDbXqyZwfmHWJ2zZELBHZCKRuov07JAcYk40D3tpH-BmQEFGCi7LnveptwFJA5Mq0hf11OHZYGCzCnZcVJYmciNueSSDFAzgkSFWIYLehfbVChFuEGKE5J8YPh5ll8iUQ__"
          className="w-[80%] sm:w-[30vw] h-[40vh] object-cover rounded-[10px] border-b-4 border-r-2 border-r-orange-600 border-b-orange-600 m-5 hover:shadow-2xl hover:shadow-orange-700 z-10"
        />
      </div>
      <div className="bg-orange-300 w-[60vw] h-[10vh] absolute right-0 top-[85%] opacity-15"></div>
      <div className="bg-orange-300 w-[30vw] h-[10vh] absolute right-0 top-[65%] opacity-15"></div>
    </div>
  );
};

export default DescriptionComponent;
