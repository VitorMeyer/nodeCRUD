import {
  Admin,
  Resource,
  ShowGuesser,
} from "react-admin";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import {UserCreate, UserEdit, UserList} from './user/index'


export const App = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider}>

    <Resource
      name="user"
      list={UserList}
      edit={UserEdit}
      show={ShowGuesser}
      create={UserCreate}
    />
  </Admin>
);
