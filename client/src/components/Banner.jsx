import backgroundImage from "../assets/images/home_banner1.jpg";

const Banner42 = (props) => {
  const title = props.title.split("#");
  return (
    <section
      className="w-screen flex flex-col justify-center bg-cover bg-center bg-no-repeat h-[30vh] sm:h-[45vh]"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="mx-auto max-w-screen px-4">
        <div className="max-h-full mt-30 max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            {title[0]}
            <strong className="block font-extrabold text-green-500">
              #{title[1]}
            </strong>
          </h1>

          <p className="mt-4 max-w-lg sm:text-xl/relaxed">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt
            illo tenetur fuga ducimus numquam ea!
          </p>
        </div>
      </div>
    </section>
  );
};

export default Banner42;
