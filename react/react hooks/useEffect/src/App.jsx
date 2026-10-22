
// import React, { useState, useEffect } from 'react';

// const App = () => {
//   const [formData, setformData] = useState({
//     name: '',
//     email: '',
//     password: '',
//   });

//   useEffect(() => {
//     console.log('Form data is:', formData);
//   }, [formData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setformData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert('Registration successful!');
//     console.log(formData);
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />
//         <br /><br />

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         <br /><br />

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />
//         <br /><br />

//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default App;

import { useRef } from 'react'

const App = () => {
  const inputRef = useRef(null);
  const handleFocus = () => {
    inputRef.current.focus();
  }
  const handleClear = () => {
    inputRef.current.value = '';
    inputRef.current.focus();
  };

  return (
    <div>
      <h1>React useRef Demo</h1>

      <input ref={inputRef} type="text" placeholder="Enter your name"/>
      <br/>
      <button onClick={handleFocus}>
        Focus Input
      </button>
      {' '}
      <button onClick={handleClear}>
        Clear Input
      </button>
    </div>
  )
}

export default App
