// src/components/Header/Header.jsx
import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../store/userSlice";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo_StudySync.svg";

import {
  NavAppBar,
  BrandMobile,
  MobileNavBox,
  DesktopNavBox,
  NavButton,
  UserBox,
} from "./Header.style";

const pages = ["CalendarSync","Tasks"];
const settings = ["Logout"];

function Header() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (setting) => {
    setAnchorElUser(null);
    if (setting === "Logout") {
      dispatch(logoutUser());
      navigate("/Login");
    };
  };

  return (
    <NavAppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          {/* Desktop Logo */}
          <img
            src={Logo}
            alt="StudySync Logo"
            style={{ height: "87px", marginRight: "16px", cursor: "pointer" }}
            onClick={() => navigate("/")}
          />

          {/* Mobile menu icon */}
          <MobileNavBox>
            <IconButton onClick={handleOpenNavMenu}>
              <MenuIcon sx={{ color: "#fff" }} />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={() => {
                    handleCloseNavMenu();
                    // if (page === "Home" && onGoToHome) onGoToHome();
                    if (page === "Tasks") navigate("/TasksPage");
                    if (page === "CalendarSync") navigate("/CalendarSync");
                  }}
                >
                  <BrandMobile component="span">{page}</BrandMobile>
                </MenuItem>
              ))}
            </Menu>
          </MobileNavBox>

          {/* Desktop Nav */}
          <DesktopNavBox>
            {pages.map((page) => (
              <NavButton
                key={page}
                onClick={() => {
                  handleCloseNavMenu();
                  if (page === "Home") navigate("/");
                  if (page === "Tasks") navigate("/TasksPage");
                  if (page === "CalendarSync") navigate("/CalendarSync");
                }}
              >
                {page}
              </NavButton>
            ))}
          </DesktopNavBox>

          {/* User Avatar */}
          <UserBox>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu}>
                <Avatar alt={user?.username || "User Avatar"}>
                  {user?.username?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={() => handleCloseUserMenu()}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleCloseUserMenu(setting)}
                >
                  {setting}
                </MenuItem>
              ))}
            </Menu>
          </UserBox>

        </Toolbar>
      </Container>
    </NavAppBar>
  );
}

export default Header;