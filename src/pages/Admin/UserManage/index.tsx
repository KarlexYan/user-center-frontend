
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { useRef } from 'react';
import {searchUser} from "@/services/ant-design-pro/api";
import {Image} from "antd";
export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};



const columns: ProColumns<API.CurrentUser>[] = [
  {
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '用户名',
    dataIndex: 'userName',
    copyable: true,
  },
  {
    title: '用户账户',
    dataIndex: 'userAccount',
    copyable: true,
  },
  {
    title: '用户头像',
    dataIndex: 'avatarUrl',
    render:(_,record)=>(
      <div>
        <img src={record.avatarUrl} width="100px" height="100px"/>
      </div>
    ),
    copyable: true,
  },
  {
    title: '用户年龄',
    dataIndex: 'userAge',
  },
  {
    title: '用户性别',
    dataIndex: 'userGender',
    valueEnum:{
      1:{text:'男',status:'Success'},
      2:{text:'女',status:'Error'}
    }
  },
  {
    title: '用户电话',
    dataIndex: 'telephone',
    copyable: true,
  },
  {
    title: 'E-Mail',
    dataIndex: 'email',
    copyable: true,
  },
  {
    title: '用户状态',
    dataIndex: 'userStatus',
    valueEnum:{
      0:{text:'正常',status:'Success'},
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    valueType: 'dateTime',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
    valueEnum:{
      0:{text:'普通用户',status:'Default'},
      1:{text:'管理员',status:'Success'}
    }
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.userId);
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();

  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter) => {
        console.log(sort, filter);
        const userList = await searchUser();
        return{
          data : userList
        }
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          // @ts-ignore
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="高级表格"

    />
  );
};
