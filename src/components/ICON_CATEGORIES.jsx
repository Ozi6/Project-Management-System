import {
    FaUsers, FaCogs, FaLightbulb, FaChartBar, FaFolder, FaDatabase,
    FaServer, FaCode, FaCog, FaDesktop, FaPaintBrush, FaDragon,
    FaRocket, FaShieldAlt, FaGem, FaStar, FaMagic
} from "react-icons/fa";
import {
    MdGroupAdd, MdAssignment, MdWork, MdBuild, MdFolderOpen
} from "react-icons/md";
import { IoMdPeople, IoMdSettings } from "react-icons/io";

export const ICON_CATEGORIES =
{
    Basic:
    [
        { name: "Users", icon: FaUsers },
        { name: "Cogs", icon: FaCogs },
        { name: "Lightbulb", icon: FaLightbulb },
        { name: "ChartBar", icon: FaChartBar },
        { name: "Folder", icon: FaFolder },
    ],
    Project:
    [
        { name: "AddGroup", icon: MdGroupAdd },
        { name: "Assignment", icon: MdAssignment },
        { name: "Work", icon: MdWork },
        { name: "Build", icon: MdBuild },
        { name: "FolderOpen", icon: MdFolderOpen },
    ],
    Tech:
    [
        { name: "Database", icon: FaDatabase },
        { name: "Server", icon: FaServer },
        { name: "Code", icon: FaCode },
        { name: "Cog", icon: FaCog },
        { name: "Desktop", icon: FaDesktop },
    ],
    Fancy:
    [
        { name: "Dragon", icon: FaDragon },
        { name: "Rocket", icon: FaRocket },
        { name: "Shield", icon: FaShieldAlt },
        { name: "Gem", icon: FaGem },
        { name: "Star", icon: FaStar },
        { name: "Magic", icon: FaMagic },
    ],
};

export const ALL_ICONS =
{
    ...Object.values(ICON_CATEGORIES).reduce((acc, category) =>
    {
        category.forEach(({ name, icon }) =>
        {
            acc[name] = icon;
            acc[`Fa${name}`] = icon;
            acc[`Md${name}`] = icon;
        });
        return acc;
    },{}),
    PaintBrush: FaPaintBrush,
    FaPaintBrush: FaPaintBrush,
};