import PageContent from "../components/PageContent";
import { Card, CardHeader, CardBody, Avatar, Image } from "@nextui-org/react";
import repoQR from "../assets/images/repo_qr.svg";
import sebasQR from "../assets/images/sebas_qr.svg";
import sebas from "../assets/images/sebas.webp";
import arthurQR from "../assets/images/arthur_qr.png";

const DiscoverPage = () => {
  return (
    <>
      <PageContent title={"Thank you for your time!"}>
        <div className="flex flex-col justify-center items-center">
          <div className="flex gap-4 my-2">
            <h4>Visit the Project Repository</h4>
            <svg
              height="32"
              aria-hidden="true"
              viewBox="0 0 16 16"
              version="1.1"
              width="32"
              data-view-component="true"
            >
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
            </svg>
          </div>
          <img src={repoQR} alt="Project Repository QR Code" />
        </div>
        <div className="my-2">
          <div className="flex justify-center items-center gap-2">
            <h4>Follow us </h4>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              data-supported-dps="24x24"
              fill="currentColor"
              className="text-blue-700"
              width="24"
              height="24"
              focusable="false"
            >
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
            </svg>
            <p>😉</p>
          </div>
          <div className="my-8 flex gap-8">
            <Card className="max-w-[200px] col-4">
              <CardHeader className="justify-between">
                <div className="flex gap-5">
                  <Avatar
                    radius="full"
                    className="w-20 h-20 object-cover"
                    src={sebas}
                  />
                  <div className="flex flex-col gap-1 items-start justify-center">
                    <h4 className="text-small font-semibold leading-none text-default-600">
                      Sebastian
                    </h4>
                    <h5 className="text-small tracking-tight text-default-400">
                      Navarro
                    </h5>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="px-3 pt-0 pb-3 text-small text-default-400">
                <Image
                  height={50}
                  alt="Album cover"
                  shadow="sm"
                  src={sebasQR}
                  width="100%"
                />
              </CardBody>
            </Card>

            <Card className="max-w-[200px] col-4">
              <CardHeader className="justify-between">
                <div className="flex gap-5">
                  <Avatar
                    radius="full"
                    className="w-20 h-20 object-cover"
                    src=""
                  />
                  <div className="flex flex-col gap-1 items-start justify-center">
                    <h4 className="text-small font-semibold leading-none text-default-600">
                      Arthur
                    </h4>
                    <h5 className="text-small tracking-tight text-default-400">
                      Limpens
                    </h5>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="px-3 pt-0 pb-3 text-small text-default-400">
                <Image
                  height={50}
                  alt="Album cover"
                  shadow="sm"
                  src={arthurQR}
                  width="100%"
                />
              </CardBody>
            </Card>
          </div>
        </div>
      </PageContent>
    </>
  );
};

export default DiscoverPage;
