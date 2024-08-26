const SiteMap = ({ data, header }) => {
  return (
    <div>
      <div className="text-[24px] sm:text-[40px] font-sans  font-extrabold text-footerHeading">
        {header}
      </div>

      <div>
        {data.map((site) => (
          <div key={site.id} className="mt-5">
            <a
              href={site.link}
              className="text-white text-[20px] sm:text-[28px] font-extrabold font-sans hover:underline hover:decoration-orange-600 hover:text-orange-100"
            >
              {site.name}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SiteMap;
