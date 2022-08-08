import axios from "axios";

export const getData = async () => {
  try {
    const { data } = await axios.get("https://d6v3yemkcmgnnjhluk5ouoqloa0wwucm.lambda-url.us-east-1.on.aws/");
    return data;
  } catch (error) {
    return error;
  }
};

export const updateComboAvailability = async (comboIdList: string[]) => {
  try {
    return await axios.put("https://combos-api.herokuapp.com/combos", comboIdList);
  } catch (error) {
    return error;
  }
};
