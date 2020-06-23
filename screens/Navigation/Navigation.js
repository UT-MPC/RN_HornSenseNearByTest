import { createAppContainer } from "react-navigation";
import { createStackNavigator} from "react-navigation-stack";

import EncounterDetails from "../EncounterDetails"

const AppNavigator = createStackNavigator(
{
  EncounterDetails:{
    screen:EncounterDetails,
    navigationOptions: { header: null}
  },
}
);

export default createAppContainer(AppNavigator);
