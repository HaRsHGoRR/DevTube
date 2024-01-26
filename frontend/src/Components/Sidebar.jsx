import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Input,
  WrapItem,
  Avatar,
} from "@chakra-ui/react";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { AiFillFire } from "react-icons/ai";
import { Badge } from "@chakra-ui/react";
import { IoAnalyticsSharp } from "react-icons/io5";
import { ChevronsLeft, ChevronsRight, LucideHistory } from "lucide-react";
import { useRef } from "react";
import { NavLink } from "react-router-dom";
import { MdSubscriptions } from "react-icons/md";
import { CiYoutube } from "react-icons/ci";
import { FaRegClock } from "react-icons/fa6";
import { CgPlayList } from "react-icons/cg";
import { FaUserAlt } from "react-icons/fa";
import UserSetting from "./UserSetting";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const userName=useSelector((state)=>state.user.data.name)
  const userImg = useSelector((state) => state.user.data.img);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: userIsOpen,
    onOpen: userOnOpen,
    onClose: userOnClose,
  } = useDisclosure();

  const btnRef = useRef();

  return (
    <>
      <div
        className="my-auto cursor-pointer mr-2 text-blue-700"
        onClick={onOpen}
      >
        <ChevronsRight />
      </div>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="xs"
        trapFocus={false}
      >
        <DrawerOverlay />
        <DrawerContent bg="gray.900" color="white" style={{ width: "13rem" }}>
          <DrawerHeader mt={1} borderBottomWidth="1px" bg="gray.900">
            <div className="flex space-x-1">
              <NavLink to="/">
                <img
                  src="https://flowbite.com/docs/images/logo.svg"
                  className="h-8 cursor-pointer"
                  alt="Flowbite Logo"
                  onClick={onClose}
                />
              </NavLink>
              <NavLink to="/">
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                  <span
                    className="text-blue-700 cursor-pointer"
                    onClick={onClose}
                  >
                    Dev
                  </span>
                  Tube
                </span>
              </NavLink>
              <button
                onClick={onClose}
                className="mt-1 cursor-pointer text-blue-700"
              >
                <ChevronsLeft />
              </button>
            </div>
          </DrawerHeader>

          <DrawerBody>
            <div className="h-full px-1  overflow-y-auto  text-white select-none">
              <ul className="space-y-2 font-normal">
                <li onClick={onClose}>
                  <NavLink
                    to="/subscriptions"
                    className="flex items-center p-2   rounded-lg text-white hover:bg-gray-600 group"
                  >
                    <span className="">
                      <MdSubscriptions />
                    </span>
                    <span className="ml-2"> Subscriptions</span>
                  </NavLink>
                </li>
                <hr />
                <Badge variant="subtle" colorScheme="blue">
                  For You
                </Badge>
                <li onClick={onClose}>
                  <NavLink
                    to="/history"
                    className="flex items-center p-2   rounded-lg text-white hover:bg-gray-600 group"
                  >
                    <span className="">
                      <LucideHistory />
                    </span>
                    <span className="ml-2"> History</span>
                  </NavLink>
                </li>
                <li onClick={onClose}>
                  <NavLink
                    to="/yourvideos"
                    className="flex items-center p-2   rounded-lg text-white hover:bg-gray-600 group"
                  >
                    <span className="">
                      <CiYoutube />
                    </span>
                    <span className="ml-2"> Your Videos</span>
                  </NavLink>
                </li>
                <li onClick={onClose}>
                  <NavLink
                    to="/watchlater"
                    className="flex items-center p-2   rounded-lg text-white hover:bg-gray-600 group"
                  >
                    <span className="">
                      <FaRegClock />
                    </span>
                    <span className="ml-2"> Watch Later</span>
                  </NavLink>
                </li>
                <li onClick={onClose}>
                  <NavLink
                    to="/playlist"
                    className="flex items-center p-2   rounded-lg text-white hover:bg-gray-600 group"
                  >
                    <span className="">
                      <CgPlayList />
                    </span>
                    <span className="ml-2"> Playlist</span>
                  </NavLink>
                </li>
                <li onClick={onClose}>
                  <NavLink
                    to="/analytics"
                    className="flex items-center p-2   rounded-lg text-white hover:bg-gray-600 group"
                  >
                    <span className="">
                      <IoAnalyticsSharp />
                    </span>
                    <span className="ml-2"> Analytics</span>
                  </NavLink>
                </li>
                <hr />
                <Badge variant="subtle" colorScheme="blue">
                  Explore
                </Badge>
                <li onClick={onClose}>
                  <NavLink
                    to="/trending"
                    className="flex items-center p-2   rounded-lg text-white hover:bg-gray-600 group"
                  >
                    <span className="">
                      <AiFillFire />
                    </span>
                    <span className="ml-2"> Trending</span>
                  </NavLink>
                </li>
                {/* <li onClick={onClose}>
                  <NavLink
                    to="/random"
                    className="flex items-center p-2   rounded-lg text-white hover:bg-gray-600 group"
                  >
                    <span className="">
                      <GiPerspectiveDiceSixFacesRandom />
                    </span>
                    <span className="ml-2"> Random</span>
                  </NavLink>
                </li> */}
                <hr />

                <li onClick={onClose}>
                  <div
                    onClick={userOnOpen}
                    className="flex items-center p-2   rounded-lg text-white hover:bg-gray-600 group"
                  >
                    {/* <span className="">
                      <FaUserAlt />
                    </span>
                    <span className="ml-2"> User</span> */}
                    <WrapItem>
                      <Avatar
                        size="sm"
                        name="Kent Dodds"
                        src={userImg}
                      />{" "}
                    </WrapItem>
                    <WrapItem ml={2}>{userName}</WrapItem>
                  </div>
                </li>
              </ul>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <UserSetting  isOpen={userIsOpen} onOpen={userOnOpen} onClose={userOnClose}/>
    </>
  );
}
