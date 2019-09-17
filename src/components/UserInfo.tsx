import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import User from './models/User';
import Todo from './models/Todo';
import { map, capitalize } from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';

interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  userDetails: User;
  userTodos: Array<Todo>;
  onClose: (value: string) => void;
}

export default function UserInfo(props: SimpleDialogProps) {
  const { onClose, selectedValue, open, userDetails, userTodos } = props;

  function handleClose() {
    onClose(selectedValue);
  }

  const itemsRender = (value: any, key: string): React.ReactFragment => {
    return (typeof value === "object") ? map(value, itemsRender) : (
      <React.Fragment key={ key }>
        <ListItem>
          <ListItemText primary={ capitalize(key) } secondary={ value } />
        </ListItem>
      </React.Fragment>
    );
  }

  return !userDetails ? null : (
    <Dialog onClose={ handleClose } aria-labelledby="simple-dialog-title" open={ open }>
      <DialogTitle id="simple-dialog-title">Card of user: { userDetails.name }</DialogTitle>
      <List>
        { map(userDetails, itemsRender) }
      </List>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Completed</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { map(userTodos, (value: any): React.ReactFragment => {
              return (
                <React.Fragment key={ value.id }>
                  <TableRow className={ clsx({ done: value.completed }) }>
                    <TableCell>{ value.title }</TableCell>
                    <TableCell>{ value.completed ? 'Done' : 'In progress' }</TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })
          }
        </TableBody>
      </Table>
    </Dialog>
  );
}
