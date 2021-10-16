// A mock function to mimic making an async request for data
export function fetchCount(amount = 1) {
  return (
    // TODO: find out why prettier is inserting () here which causes failure
    // prettier-ignore
    new Promise <
    { data: number } >
    ((resolve) => setTimeout(() => resolve({ data: amount }), 500))
  );
}
