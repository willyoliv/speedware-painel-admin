// import "dotenv/config";
import axios from "axios";

const api = axios.create({
  baseURL: "https://combos-api.herokuapp.com",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const getData = async () => {
  try {
    const { data } = await api.get("/combos");
    return data;
  } catch (error) {
    return error;
  }
};

export const updateComboAvailability = async (comboIdList: string[]) => {
  try {
    return await api.put("/combos", comboIdList);
  } catch (error) {
    return error;
  }
};
