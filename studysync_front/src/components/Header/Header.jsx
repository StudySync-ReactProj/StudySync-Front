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
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/dark.svg";
import ThemeToggleButton from "../ThemeToggleButton/ThemeToggleButton";
import Wrapper from "../Wrapper/Wrapper.jsx";
import LogoDark from "../../assets/white.png";
import { useTheme } from "@mui/material/styles";

import {
  NavAppBar,
  BrandMobile,
  MobileNavBox,
  DesktopNavBox,
  NavButton,
  UserBox,
  ToolbarContainer,
  LeftGroup,
  RightGroup,
  LogoImg
} from "./Header.style";

// Use objects so we can keep paths consistent and case-sensitive
const pages = [
  { label: "CalendarSync", path: "/CalendarSync" },
  { label: "Tasks", path: "/TasksPage" },
];
const settings = ["Logout"];

function Header({ theme, setTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  // Use centralized user context instead of direct Redux selector
  const { user } = useUser();
  const dispatch = useDispatch();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === "dark";

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
        <ToolbarContainer disableGutters>
          {/* LEFT SIDE */}
          <LeftGroup>
            <LogoImg
              src={isDark ? LogoDark : Logo}
              alt="StudySync Logo"
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
                    key={page.label}
                    onClick={() => {
                      setAnchorElNav(null);
                      navigate(page.path);
                    }}
                  >
                    <BrandMobile component="span">{page.label}</BrandMobile>
                  </MenuItem>
                ))}
              </Menu>
            </MobileNavBox>

            {/* Desktop nav */}
            <DesktopNavBox>
              {pages.map((page) => {
                const isActive = location.pathname === page.path;
                return (
                  <NavButton
                    key={page.label}
                    active={isActive}
                    onClick={() => navigate(page.path)}
                  >
                    {page.label}
                  </NavButton>
                );
              })}
            </DesktopNavBox>
          </LeftGroup>

          {/* RIGHT SIDE */}
          <RightGroup>
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
          </RightGroup>
        </ToolbarContainer>
      </Wrapper>
    </NavAppBar>
  );
}

export default Header;
