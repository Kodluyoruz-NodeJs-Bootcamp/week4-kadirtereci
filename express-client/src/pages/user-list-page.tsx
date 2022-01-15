import React from "react";
import { DataGrid } from "@material-ui/data-grid";
import { Card, CardContent, Typography } from "@material-ui/core";

export default function UserListPage() {
  const [userList, setUserList] =
    React.useState<[{ _id: string; name: string }]>();
  const [showLoading, setShowLoading] = React.useState(true);

  const pullUsers = async () => {
    setShowLoading(true);
    try {
      const response = await (
        await fetch("http://localhost:5000/auth/users", {
          credentials: "include",
        })
      ).json();
      if (response) setUserList(response);
    } catch (err) {
      console.log(err);
    }

    setShowLoading(false);
  };

  React.useEffect(() => {
    pullUsers();
  }, []);

  return (
    <>
      <Card>
        <CardContent>
          {" "}
          <Typography variant={"h4"} color="primary">
            Kullanıcı Listesi
            <hr />
          </Typography>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              loading={showLoading}
              rows={userList || []}
              columns={[
                {
                  field: "_id",
                  headerName: "_id",
                  width: 90,
                },
                {
                  field: "name",
                  headerName: "ad-soyad",
                  width: 300,
                },
                {
                  field: "email",
                  headerName: "email",
                  width: 300,
                },
              ]}
              pageSize={5}
            />{" "}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
