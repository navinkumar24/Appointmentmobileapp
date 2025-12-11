import { useSelector } from "react-redux";
import useColorsList from "./ColorsList";
import type { RootState } from "../store/store";
import type { ColorTheme } from "../types/ColorTheme";

function useColorSchemes(): ColorTheme {
    const { themeColorsIndex } = useSelector((state: RootState) => state.theme);
    const lists = useColorsList();
    return lists[themeColorsIndex]?.colorTheme
}

export default useColorSchemes;
