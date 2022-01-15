import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Snackbar,
} from "@material-ui/core";
import { FormTextField } from "../components";
import { Formik } from "formik";
import React, { ErrorInfo, useState } from "react";
import * as yup from "yup";
import {
  AccountCircle as AccountCircleIcon,
  Lock as LockIcon,
  VpnKey as VpnKeyIcon,
} from "@material-ui/icons";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { useNavigate } from "react-router-dom";
import { email } from "envalid";
import ClientApi from "../api/ClientApi";
import postData from "../api/ClientApi";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function LoginPage() {
  const history = useNavigate();
  const [showResponseError, setShowResponseError] = useState(false);
  const [showResponseErrorMessage, setShowResponseErrorMessage] = useState("");

  const loginFormSchema = yup.object({
    email: yup.string().required("Email alanı boş olamaz"),
    password: yup.string().required("Şifre alanı boş olamaz."),
    name: yup.string().when("isRegister", {
      is: (value) => value === true,
      then: yup.string().required("isim bilgisi boş olamaz"),
      otherwise: yup.string(),
    }),
  });
  

  const onSubmit = async (data) => {
    try {
      const response = data.isRegister
        ? await postData(
            "http://localhost:5000/auth/register",

            data
          )
        : await postData(
            "http://localhost:5000/auth/login",

            data
          );
      if (response.status === 200) {
        history("/users");
      } else {
        const errorMessage = await response.json();
        setShowResponseError(true);
        setShowResponseErrorMessage(errorMessage.message);
      }
    } catch (error: any) {
      setShowResponseError(true);
    }
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setShowResponseError(false);
  };

  const initialValues = {
    email: "",
    password: "",
    name: "",
    isRegister: false,
  };
  return (
    <React.Fragment>
      <Snackbar
        open={showResponseError}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error">
          <b>
            {" "}
            {showResponseErrorMessage ||
              "Giriş bilgilerinizi kontrol edip tekrar deneyiniz"}
          </b>
        </Alert>
      </Snackbar>
      <div
        style={{
          backgroundImage: `url(${"/src/images/background.jpg"})`,
          minHeight: "100vh",
          minWidth: "100vh",
        }}
      >
        <Grid
          container
          spacing={2}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={12} md={3}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <Card style={{ marginTop: "20px" }}>
                <Formik
                  onSubmit={onSubmit}
                  validationSchema={loginFormSchema}
                  validateOnChange={false}
                  validateOnBlur={false}
                  initialValues={initialValues}
                >
                  {({
                    handleSubmit,
                    handleChange,
                    errors,
                    values,
                    setFieldValue,
                  }) => (
                    <form onSubmit={handleSubmit} noValidate>
                      <CardContent>
                        <Box mt={2}>
                          <Grid container direction="column" spacing={2}>
                            {values.isRegister && (
                              <Grid item xs={12}>
                                <FormTextField
                                  id="name"
                                  type="name"
                                  label="name"
                                  margin="dense"
                                  name="name"
                                  required
                                  onChange={handleChange}
                                  error={errors.name != null}
                                  helperText={errors.name}
                                  placeholder="name"
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <AccountCircleIcon />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>
                            )}
                            <React.Fragment>
                              <Grid item xs={12}>
                                <FormTextField
                                  id="email"
                                  type="email"
                                  label="Email"
                                  margin="dense"
                                  name="email"
                                  required
                                  onChange={handleChange}
                                  error={errors.email != null}
                                  helperText={errors.email}
                                  placeholder="Email"
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <AccountCircleIcon />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <FormTextField
                                  id="password"
                                  type="password"
                                  name="password"
                                  required
                                  error={errors.password != null}
                                  helperText={errors.password}
                                  onChange={handleChange}
                                  placeholder="Parola"
                                  label="Şifre"
                                  margin="dense"
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <LockIcon />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>
                            </React.Fragment>

                            <Grid item xs={12}>
                              <Button
                                color="secondary"
                                type="submit"
                                variant="contained"
                                disableElevation
                                fullWidth
                                startIcon={<VpnKeyIcon />}
                              >
                                {values.isRegister ? "Kayıt ol" : "Giriş Yap"}
                              </Button>
                            </Grid>
                            <Grid item xs={12}>
                              <Button
                                fullWidth
                                color="primary"
                                style={{ fontSize: "12px", fontFamily: "bold" }}
                                onClick={() => {
                                  setFieldValue(
                                    "isRegister",
                                    !values.isRegister
                                  );
                                }}
                              >
                                {values.isRegister ? (
                                  <b>Zaten hesabın var mı? Giriş yap! </b>
                                ) : (
                                  <b> Hesabın yok mu? Hemen kayıt ol! </b>
                                )}
                              </Button>
                            </Grid>
                          </Grid>
                        </Box>
                      </CardContent>
                    </form>
                  )}
                </Formik>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
}
