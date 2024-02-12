import React, { useEffect, useState } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  Button,
  Center,
} from "@chakra-ui/react";
import RegLog from "../../Components/RegLog";
import Modalss from "../../Components/Modalss";
import FileUpload from "../../Components/FileUpload";
import { useSelector } from "react-redux";
import { ShowVideos } from "../../Components/ShowVideos";
import { Spinner } from "flowbite-react";
const Home = () => {
   useEffect(() => {
     window.scrollTo(0, 0);
   }, []);
  const { data: user, error, loading } = useSelector((state) => state.user);

  return (
    <div className="pt-5">
      {loading ? (
        <></>
      ) : (
        <>
          {user ? (
            <>
              <ShowVideos type={"random"} />{" "}
            </>
          ) : (
            <>Home Page Please Login</>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
