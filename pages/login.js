import Link from 'next/link';
import React from 'react'
import Router from 'next/router';
import Input from 'antd/lib/input';

export default class Index extends React.Component {
    login = () => {
        Router.push('/index');
    }
    render() {
        return (
            <div className="wrap">
                <div className="box">
                    <Search
                        placeholder="input search text"
                        onSearch={value => console.log(value)}
                        enterButton
                    />
                </div>
                to log in
                <style jsx>{`
                `}</style>
            </div>
        );
    }

}