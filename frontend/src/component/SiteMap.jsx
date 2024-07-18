const SiteMap = ({ data, header }) => {
  return (
    <div>
      <div className="text-[24px] sm:text-[30px] font-sans font-semibold text-footerHeading">
        {header}
      </div>

      <div>
        {data.map((site) => (
          <div key={site.id} className="mt-5">
            <a
              href={site.link}
              className="text-white text-[20px] sm:text-[28px] font-extralight font-sans "
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
