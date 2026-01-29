// src/components/Header/Header.jsx
import * as React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/userSlice";
import { useUser } from "../../context/UserContext";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo_StudySync.svg";
import ThemeToggleButton from "../ThemeToggleButton/ThemeToggleButton";
import Wrapper from "../Wrapper/Wrapper.jsx";

import {
  NavAppBar,
  BrandMobile,
  MobileNavBox,
  DesktopNavBox,
  NavButton,
  UserBox,
} from "./Header.style";

const pages = ["CalendarSync", "Tasks"];
const settings = ["Logout"];

function Header({ theme, setTheme }) {
  const navigate = useNavigate();
  // Use centralized user context instead of direct Redux selector
  const { user, username } = useUser();
  const dispatch = useDispatch();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleCloseUserMenu = (setting) => {
    setAnchorElUser(null);
    if (setting === "Logout") {
      dispatch(logoutUser());
      navigate("/login");
    }
  };

  return (
    <NavAppBar position="static">
      <Wrapper>
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          {/* LEFT SIDE */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img
              src={Logo}
              alt="StudySync Logo"
              style={{ height: "80px", cursor: "pointer", marginLeft: "-20px", marginTop: "8px" }}
              onClick={() => navigate("/dashboard")}
            />

            {/* Mobile menu */}
            <MobileNavBox>
              <IconButton onClick={(e) => setAnchorElNav(e.currentTarget)}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={() => setAnchorElNav(null)}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page}
                    onClick={() => {
                      setAnchorElNav(null);
                      if (page === "Tasks") navigate("/TasksPage");
                      if (page === "CalendarSync") navigate("/calendarSync");
                    }}
                  >
                    <BrandMobile component="span">{page}</BrandMobile>
                  </MenuItem>
                ))}
              </Menu>
            </MobileNavBox>

            {/* Desktop nav */}
            <DesktopNavBox>
              {pages.map((page) => (
                <NavButton
                  key={page}
                  onClick={() => {
                    if (page === "Tasks") navigate("/TasksPage");
                    if (page === "CalendarSync") navigate("/CalendarSync");
                  }}
                >
                  {page}
                </NavButton>
              ))}
            </DesktopNavBox>
          </div>

          {/* RIGHT SIDE */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ThemeToggleButton theme={theme} setTheme={setTheme} />
            <UserBox>
              <Tooltip title="Open settings">
                <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)}>
                  <Avatar>
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
          </div>
        </Toolbar>
      </Wrapper>
    </NavAppBar>
  );
}

export default Header;
