import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/FromNavbar/Home";
import About from "./Pages/FromNavbar/About";
import Contact from "./Pages/FromNavbar/Contact";
import Navbar from "./Components/Navbar";
import { useEffect, useState } from "react";
import { initFlowbite } from "flowbite";
import TrendingPage from "./Pages/FromSidebar/TrendingPage";
import SubscriptionPage from "./Pages/FromSidebar/SubscriptionPage";
import HistoryPage from "./Pages/FromSidebar/HistoryPage";
import RandomPage from "./Pages/FromSidebar/RandomPage";
import WatchLaterPage from "./Pages/FromSidebar/WatchLaterPage";
import PlaylistPage from "./Pages/FromSidebar/PlaylistPage";
import AnalyticsPage from "./Pages/FromSidebar/AnalyticsPage";
import YourVideos from "./Pages/FromSidebar/YourVideos";
import { fetchUser } from "../State/User/userAction";
import { fetchHistory } from "../State/History/historyAction";
import { useDispatch, useSelector } from "react-redux";
import User from "./Pages/User";
import Error from "./Pages/Error";
import Video from "./Components/Video";
import "@fortawesome/fontawesome-free/css/all.css";
import { fetchVideos } from "../State/Videos/videosAction";
import { fetchWatchLater } from "../State/Watchlater/watchLaterAction";

function App() {
  const [showSide, setShowSide] = useState(false);
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.user);

  const showSidebar = () => {
    setShowSide(!showSide);
    document.body.classList.toggle("no-scroll", showSide);
  };
  useEffect(() => {
    initFlowbite();
  }, []);

  useEffect(() => {
    // console.log(data);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const fetchData = async () => {
      await dispatch(fetchUser(userInfo));
      await dispatch(fetchHistory(userInfo));
      await dispatch(fetchVideos(userInfo));
      await dispatch(fetchWatchLater(userInfo));
    };

    if (!userInfo) {
    } else {
      fetchData();
    }
  }, []);

  return (
    <BrowserRouter>
      <Navbar />

      <div className="md:px-4 px-0 w-full bg-gray-900  text-white pt-1 min-h-screen  ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/subscriptions" element={<SubscriptionPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/random" element={<RandomPage />} />
          <Route path="/watchlater" element={<WatchLaterPage />} />
          <Route path="/playlist" element={<PlaylistPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/yourvideos" element={<YourVideos />} />
          <Route path="/user" element={<User />} />
          <Route path="/video" element={<Video />} />

          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
