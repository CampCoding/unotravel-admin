import Table from "../../Shared/Table/Table.jsx";

export default function Massages() {
  const head = ["name", "email", "message Title", "message"];
  const data = [
    {
      name: "name",
      email: "email",
      messagetitle: "message",
      message: "message",
    },
  ];
  return (
    <>
      <div className="mb-6 mx-10 mt-10 border-b border-gray-200 pb-2">
        <h1 className="text-3xl font-semibold text-gray-800 tracking-wide">
          Messages
        </h1>
      </div>
      <Table head={head} data={data} />
    </>
  );
}
