function ListGroup() {
  let items = ["New York", "San Francisco", "Tokyo", "London", "Malaysia"];
  //TS dont have for loop, instead we using map
  //items.map((item) => <li>{item}</li>)
  //        {items.map((item) => (<li>{item}</li>))}
  //
  //

  const message = items.length === 0 ? <p>No item found</p> : null;

  const getMessage = () => {
    return items.length === 0 ? <p>No Item Found</p> : null;
  };
  return (
    //<> meaning to use <Fragment>, when trying to return more than one thing in a component, then we should use <>
    <>
      <h1>List</h1>
      {message}
      <ul className="list-group">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
