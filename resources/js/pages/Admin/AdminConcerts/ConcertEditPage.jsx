import React from 'react';

export default function ConcertEditPage() {
    const concertId = "123";

    return (
        <div className="container main-content-area" style={{padding: '50px', textAlign: 'center'}}>
            <h1>ADMIN: Կոնցերտի Խմբագրում (ID: {concertId})</h1>
            <p>Այս էջը թույլ կտա ադմինիստրատորին խմբագրել գոյություն ունեցող կոնցերտի տվյալները։</p>
        </div>
    );
}
