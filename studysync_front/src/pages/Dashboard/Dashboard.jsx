import { useSelector } from "react-redux";
import MainTitle from "../../components/MainTitle/MainTitle.jsx";
import CardContainerComp from "../../components/CardContainer/CardContainer.jsx";
import Wrapper from "../../components/Wrapper/Wrapper.jsx";

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 22) return "Good evening";
    return "Good night";
  };

  return (
    <Wrapper>
      <MainTitle title={`${getGreeting()}, ${user?.username || "User"}!`} />
      <CardContainerComp />
    </Wrapper>
  );
};

export default Dashboard;
