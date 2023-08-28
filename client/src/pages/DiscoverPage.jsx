import PageContent from "../components/PageContent";
import { Card, CardHeader, CardBody, Avatar } from "@nextui-org/react";
import repoQR from "../assets/images/repo_qr.svg";
import sebas from "../assets/images/sebas.webp";

const DiscoverPage = () => {
  return (
    <>
      <PageContent title={"Thank you for your time!"}>
        <div className="flex justify-evenly items-center">
          <div className="flex flex-col justify-center items-center">
            <div className="flex gap-4 my-2">
              <h4 className="">Visit the Project Repository</h4>
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
          <div className="flex flex-col justify-start items-center">
            <h4 className="p-4">This project was created with</h4>
            <div className="flex gap-4 my-2">
              <Avatar
                isBordered
                radius="sm"
                size="lg"
                src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg"
                className="bg-white"
              />
              <Avatar
                isBordered
                radius="sm"
                size="lg"
                src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redux/redux-original.svg"
                className="bg-white"
              />
              <Avatar
                isBordered
                radius="sm"
                size="lg"
                src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg"
                className="bg-white"
              />
              <Avatar
                isBordered
                radius="sm"
                size="lg"
                src="https://raw.githubusercontent.com/nextui-org/nextui/main/apps/docs/public/isotipo.png"
                className="bg-white"
              />
            </div>
            <div className="flex gap-4 my-2">
              <Avatar
                isBordered
                radius="sm"
                size="lg"
                src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg"
                className="bg-white"
              />
              <Avatar
                isBordered
                radius="sm"
                size="lg"
                src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg"
                className="bg-white"
              />
              <Avatar
                isBordered
                radius="sm"
                size="lg"
                src="https://www.vectorlogo.zone/logos/graphql/graphql-icon.svg"
                className="bg-white"
              />
              <Avatar
                isBordered
                radius="sm"
                size="lg"
                src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg"
                className="bg-white"
              />
            </div>
          </div>
        </div>
        <div className="my-2">
          <div className="flex justify-center items-center gap-2">
            <h4>The Team</h4>
          </div>
          <div className="my-8 flex justify-evenly">
            <Card className="max-w-[400px] max-h-[260px] col-4">
              <CardHeader className="justify-between">
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-small font-semibold leading-none text-default-600">
                    Sebastian
                  </h4>
                  <h5 className="text-small tracking-tight text-default-400">
                    Navarro
                  </h5>
                </div>
              </CardHeader>
              <CardBody className="px-3 pt-0 pb-3 text-small text-default-400">
                <Avatar
                  radius="full"
                  className="w-48 h-48 shadow-lg"
                  shadow="lg"
                  src={sebas}
                />
              </CardBody>
            </Card>

            <Card className="max-w-[400px] max-h-[260px] col-4">
              <CardHeader className="justify-between">
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-small font-semibold leading-none text-default-600">
                    Arthur
                  </h4>
                  <h5 className="text-small tracking-tight text-default-400">
                    Limpens
                  </h5>
                </div>
              </CardHeader>
              <CardBody className="px-3 pt-0 pb-3 text-small text-default-400">
                <Avatar
                  radius="full"
                  className="w-48 h-48 object-cover"
                  shadow="lg"
                  src="https://ca.slack-edge.com/T039P7U66-U04D853ULD6-73e6c40aae7c-512"
                />
              </CardBody>
            </Card>

            <Card className="max-w-[400px] max-h-[260px] col-4">
              <CardHeader className="justify-between">
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-small font-semibold leading-none text-default-600">
                    Simona
                  </h4>
                  <h5 className="text-small tracking-tight text-default-400">
                    Aimar
                  </h5>
                </div>
              </CardHeader>
              <CardBody className="px-3 pt-0 pb-3 text-small text-default-400">
                <Avatar
                  radius="full"
                  className="w-48 h-48 object-cover"
                  shadow="lg"
                  src="https://media.licdn.com/dms/image/C4D03AQGfvsirToV46A/profile-displayphoto-shrink_800_800/0/1603286216025?e=1698278400&v=beta&t=0JA-8rO4NSHGiAsIw0hk0MU-msMkzywIo0aEYwUVWRQ"
                />
              </CardBody>
            </Card>

            <Card className="max-w-[400px] max-h-[260px] col-4">
              <CardHeader className="justify-between">
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-small font-semibold leading-none text-default-600">
                    Taka
                  </h4>
                  <h5 className="text-small tracking-tight text-default-400">
                    Nakajo
                  </h5>
                </div>
              </CardHeader>
              <CardBody className="px-3 pt-0 pb-3 text-small text-default-400">
                <Avatar
                  radius="full"
                  className="w-48 h-48 object-cover"
                  shadow="lg"
                  src="https://ca.slack-edge.com/T039P7U66-U04CBRG1NT0-068cee76b5c5-512"
                />
              </CardBody>
            </Card>

            <Card className="max-w-[400px] max-h-[260px] col-4">
              <CardHeader className="justify-between">
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-small font-semibold leading-none text-default-600">
                    Attila
                  </h4>
                  <h5 className="text-small tracking-tight text-default-400">
                    Kekesi
                  </h5>
                </div>
              </CardHeader>
              <CardBody className="px-3 pt-0 pb-3 text-small text-default-400">
                <Avatar
                  radius="full"
                  className="w-48 h-48 object-cover"
                  shadow="lg"
                  src="https://ca.slack-edge.com/T039P7U66-U04D8513SQ0-ce69105dae18-192"
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
