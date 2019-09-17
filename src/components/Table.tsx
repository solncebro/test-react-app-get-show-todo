import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import UserInfo from './UserInfo';
import User from './models/User';
import Todo from './models/Todo';
import clsx from 'clsx';

type Order = 'asc' | 'desc';

function createUser({ id, username, email, name, website, phone, company, address }: {
  id: number,
  username: string,
  email: string,
  name: string,
  website: string,
  phone: string,
  company: object,
  address: object
}): User {
  return { id, username, email, name, website, phone, company, address };
}

function createTodo({ id, userId, title, completed }: {
  id: number,
  userId: number,
  title: string,
  completed: boolean,
}): Todo {
  return { id, userId, title, completed };
}

const TableComponent: React.FC = () => {
  const [users, setUsers] = useState<Array<User>>([]);
  const [usersTodos, setUsersTodos] = useState<Array<Todo>>([]);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState('username');
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState();
  const [userDetails, setUserDetails] = useState<User>(users[0]);
  const [userTodos, setUserTodos] = useState<Array<Todo>>([usersTodos[0]]);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users').then(res => {
      const users = res.data.map((item: any): User => createUser(item))
      setUsers(users);
    })
  }, []);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users/1/todos').then(res => {
      const todos = res.data.map((item: any): Todo => createTodo(item))
      setUsersTodos(todos);
    })
  }, []);

  const hadleSort = (sortBy: string) => () => {
    const isSameOrderBy = sortBy === orderBy;
    const newOrder = (isSameOrderBy) ? (order === 'asc' ? 'desc' : 'asc') : 'asc';
    
    if (!isSameOrderBy) {
      setOrderBy(sortBy);
    }
    setOrder(newOrder);

    const sortedUser = users.sort((a: User, b: User) => {
      const valueA = newOrder === 'asc' ? a[sortBy] : b[sortBy];
      const valueB = newOrder === 'asc' ? b[sortBy] : a[sortBy];

      if (valueB > valueA) {
        return -1;
      }
      if (valueB < valueA) {
        return 1;
      }
      return 0;
    });
    setUsers(sortedUser);
  }

  const handleClickOpen = (userId: number) => () => {
    setOpen(true);

    const [ userDetails ] = users.filter((item) => item.id === userId);
    const userTodos= usersTodos.filter((item) => item.userId === userId);

    setUserDetails(userDetails);
    setUserTodos(userTodos);
  }

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel direction={ order } onClick={ hadleSort('username') }>
                Username
              </TableSortLabel>
            </TableCell>
            <TableCell>Email</TableCell>
            <TableCell>
              <TableSortLabel direction={ order } onClick={ hadleSort('website') }>
                Website
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { users.map((user, index) => {
              return (
                <TableRow key={ user.id } className={ clsx({ even: (index % 2) }) } onClick={ handleClickOpen(user.id) }>
                  <TableCell>{ user.username }</TableCell>
                  <TableCell>{ user.email }</TableCell>
                  <TableCell>{ user.website }</TableCell>
                </TableRow>
              );
            })
          }
        </TableBody>
      </Table>
      <UserInfo selectedValue={ selectedValue } open={ open } onClose={ handleClose } userDetails={ userDetails } userTodos={ userTodos } />
    </div>
  );
}

export default TableComponent;