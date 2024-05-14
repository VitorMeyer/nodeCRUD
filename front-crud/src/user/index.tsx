import { Datagrid, EmailField, List, TextField, Create, ResourceComponentInjectedProps, SimpleForm, TextInput, Edit } from 'react-admin';

export const UserList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" />
            <EmailField source="email" />
        </Datagrid>
    </List>
);

export const UserCreate = (props: ResourceComponentInjectedProps) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="email" />
            <TextInput source="phone" />
        </SimpleForm>
    </Create>
);

export const UserEdit = (props: ResourceComponentInjectedProps) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="email" />
            <TextInput source="phone" />
        </SimpleForm>
    </Edit>
);

// <TextField source="company.name" />