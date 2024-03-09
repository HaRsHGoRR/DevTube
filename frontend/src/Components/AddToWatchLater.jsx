import { useToast } from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addWatchLater } from "../../State/Watchlater/watchLaterAction";

const AddToWatchLater = ({ children,id }) => {
  const { data: watchLater } = useSelector((state) => state.watchLater);
  const dispath=useDispatch()
  const toast=useToast()
  const { data } = useSelector((state) => state.user);
  

  const addToWatchLater = () => {
    try {
      const exist = watchLater?.some((obj) => {
        return obj._id == id;
      });

      if (exist) {
        toast({
          title: "Already added to Watch Later.",
          //  description: "We've created your account for you.",
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        return;
      }
      dispath(addWatchLater(data, id, {}));
      toast({
        title: "Added to Watch Later.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      toast({
        title: "Could not add to Watch Later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <div
      onClick={() => {
      addToWatchLater()
      }}
    >
      {children}
    </div>
  );
};

export default AddToWatchLater;
