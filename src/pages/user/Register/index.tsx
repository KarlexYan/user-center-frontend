import Footer from '@/components/Footer';
import {register} from '@/services/ant-design-pro/api';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {LoginForm,ProFormText} from '@ant-design/pro-components';
import { message, Tabs } from 'antd';
import React, { useState } from 'react';
import {history, Link} from 'umi';
import styles from './index.less';

const Register: React.FC = () => {
  const [type, setType] = useState<string>('account');

  // 表单提交
  const handleSubmit = async (values: API.RegisterParams) => {
    const{userPassword,checkPassword} = values;
    // 校验
    if(userPassword!==checkPassword){
      message.error('输入的两次密码不一致');
      return;
    }

    try {
      const id = await register({
        ...values
      });
      if (id >= 0) {
        const defaultLoginSuccessMessage = '注册成功！';
        message.success(defaultLoginSuccessMessage);
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        history.push({
          pathname : '/user/login',
          query,
        });
        return;
      }else{
        throw new Error(`register error. id = ${id}`);
      }
      // 如果失败去设置用户错误信息
      // setUserLoginState(user);
    } catch (error) {
      const defaultLoginFailureMessage = '注册失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          // 修改按钮的文本
          submitter={{
            searchConfig:{
              submitText : '注册'
            }
          }}

          logo={<img alt="logo" src="/cat.jpg" />}
          title="KarlexYan Design"
          subTitle={"KarlexYan's Project with Ant Design Pro. Thanks!"}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.RegisterParams);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane key="account" tab={'账号密码注册'} />
          </Tabs>


          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入用户名'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                  {
                    min : 4,
                    type:'string',
                    message: '用户名不能少于4位！',
                  }
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min : 6,
                    type:'string',
                    message: '密码不能少于6位！',
                  }
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请再次输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min : 6,
                    type:'string',
                    message: '密码不能少于6位！',
                  }
                ]}
              />
            </>
          )}

          <div
            style={{
              marginBottom: 24,
            }}
          >

            <a
              style={{
                float: 'right',
              }}
            >
              <Link to='/user/login'>返回登录页</Link>
            </a>
          </div>

        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Register;
