import React, { useEffect, useState } from "react";
import {
  Text,
  Button,
  Stack,
  Box,
  VStack,
  HStack,
  Pressable,
  PresenceTransition,
  useToast,
  FormControl,
  Input,
} from "native-base";
import * as studentServiceRegistry from "../../services/studentServiceRegistry";
import * as classServiceRegistry from "../../services/classServiceRegistry";
import { useTranslation } from "react-i18next";
import Layout from "../../../layout/Layout";
import { Link, useParams } from "react-router-dom";
import AttendanceComponent, {
  GetAttendance,
} from "../../../components/attendance/AttendanceComponent";
import Menu from "../../../components/Menu";
import manifest from "../../../modules/attendance/manifest.json";
import Card from "../../../components/students/Card";
import IconByName from "../../../components/IconByName";

// Start editing here, save and see your changes.
export default function App() {
  const { t } = useTranslation();
  const [studentObject, setStudentObject] = useState({});
  const [classObject, setClassObject] = useState({});
  const { studentId } = useParams();
  const [attendance, setAttendance] = useState([]);
  const teacherId = sessionStorage.getItem("id");
  const toast = useToast();
  const onlyParameter = [
    "firstName",
    "lastName",
    "address",
    "fathersName",
    "phoneNumber",
    "email",
    "gender",
  ];
  const parameter = {
    firstName: { placeholder: "First name", required: true },
    lastName: { placeholder: "Last name" },
    address: { placeholder: "Address" },
    fathersName: { placeholder: "Parent Name" },
    phoneNumber: { placeholder: "Phone number" },
    email: { placeholder: "Email", type: "email" },
  };
  const formInputs = onlyParameter.map((e) => {
    return {
      placeholder: parameter[e]?.placeholder ? parameter[e].placeholder : e,
      isRequired: parameter[e]?.required ? parameter[e].required : false,
      type: parameter[e]?.type ? parameter[e].type : "text",
      value: studentObject[e] ? studentObject[e] : "",
    };
  });

  useEffect(() => {
    let ignore = false;

    const getData = async () => {
      let student = await studentServiceRegistry.getOne({ id: studentId });

      let classObj = await classServiceRegistry.getOne({
        id: student.currentClassID,
      });
      if (!ignore) {
        setStudentObject({ ...student, className: classObj.className });
        setClassObject(classObj);
        await getAttendance({ classId: student.currentClassID });
      }
    };
    getData();
  }, [studentId]);

  const getAttendance = async (e) => {
    const attendanceData = await GetAttendance({
      studentId: {
        eq: studentId,
      },
      classId: {
        eq: e.classId ? e.classId : studentObject.currentClassID,
      },
      teacherId: {
        eq: teacherId,
      },
    });

    setAttendance(attendanceData);
  };

  const InfoSection = ({ items, isLastBorderEnable }) =>
    items.map((item, index) => (
      <VStack
        space="3"
        p="5"
        borderBottomWidth={
          items.length - 1 !== index || isLastBorderEnable ? "1" : "0"
        }
        borderColor={"coolGray.200"}
        key={index}
      >
        <Text fontSize={"14px"} fontWeight="500" color={"coolGray.400"}>
          {item.title}
        </Text>
        {item.value ? (
          <Text>{item.value}</Text>
        ) : (
          <Text italic>{t("NOT_ENTERD")}</Text>
        )}
      </VStack>
    ));

  const Section = ({ title, button, children, _box }) => (
    <Box bg={"white"} p="5" {..._box}>
      <HStack alignItems={"center"} justifyContent={"space-between"}>
        <Text fontSize="16px" fontWeight="500">
          {title}
        </Text>
        {button}
      </HStack>
      {children}
    </Box>
  );

  return (
    <Layout
      _header={{
        title: t("STUDENTS_DETAIL"),
        subHeading: t("ABOUT"),
      }}
      subHeader={
        <Card
          textTitle={studentObject.fullName}
          _textTitle={{ bold: false, fontWeight: "500", fontSize: "16px" }}
          _textSubTitle={{
            bold: false,
            fontWeight: "400",
            fontSize: "12px",
            color: "coolGray.800",
          }}
          type="card"
          item={studentObject}
          hidePopUpButton={true}
        />
      }
      _subHeader={{ bg: "studentCard.500" }}
    >
      <Stack space={2}>
        <Section
          title={t("DETAILS")}
          button={
            <Button
              variant="ghost"
              colorScheme="button"
              endIcon={<IconByName name={"pencil-alt"} isDisabled />}
              _text={{ fontWeight: "400" }}
            >
              {t("EDIT")}
            </Button>
          }
        >
          <VStack>
            <FormControl>
              <Stack space={3}>
                {formInputs.map((item, index) => {
                  return (
                    <VStack
                      space="3"
                      p="5"
                      borderBottomWidth={
                        formInputs.length - 1 !== index ? "1" : "0"
                      }
                      borderColor={"coolGray.200"}
                      key={index}
                    >
                      <Text
                        fontSize={"14px"}
                        fontWeight="500"
                        color={"coolGray.400"}
                      >
                        {item.placeholder}
                      </Text>
                      {item.value ? (
                        <Text>{item.value}</Text>
                      ) : (
                        <Text italic>{t("NOT_ENTERD")}</Text>
                      )}
                    </VStack>
                  );
                })}
              </Stack>
            </FormControl>
          </VStack>
        </Section>

        <Section title={t("ACADEMIC")}>
          <InfoSection
            isLastBorderEnable
            items={[
              {
                title: t("CLASS"),
                value: studentObject?.className
                  ? studentObject?.className
                  : studentObject.currentClassID,
              },
            ]}
          />
          <Box bg="white" p="5">
            <Collapsible
              defaultCollapse
              header={t("WEEK_ATTENDANCE")}
              body={
                <>
                  {manifest.showOnStudentProfile &&
                  studentObject &&
                  studentObject?.id ? (
                    <AttendanceComponent
                      weekPage={0}
                      student={studentObject}
                      withDate={true}
                      hidePopUpButton={true}
                      attendanceProp={attendance}
                      getAttendance={getAttendance}
                      _card={{
                        img: false,
                        _textTitle: { display: "none" },
                        _textSubTitle: { display: "none" },
                      }}
                    />
                  ) : (
                    <></>
                  )}
                  <HStack space={2} justifyContent={"center"}>
                    <Link
                      to={"/attendance/" + studentObject.currentClassID}
                      style={{
                        textDecoration: "none",
                        flex: "auto",
                        textAlign: "center",
                      }}
                    >
                      <Box
                        rounded="lg"
                        borderColor="button.500"
                        borderWidth="1"
                        _text={{ color: "button.500" }}
                        px={4}
                        py={2}
                      >
                        {t("FULL_CLASS_ATTENDANCE")}
                      </Box>
                    </Link>
                  </HStack>
                </>
              }
            />
          </Box>
        </Section>

        <Section
          title={t("LEARNING")}
          button={
            <Button
              variant="ghost"
              colorScheme="button"
              endIcon={<IconByName name={"pencil-alt"} isDisabled />}
              _text={{ fontWeight: "400" }}
            >
              {t("EDIT")}
            </Button>
          }
        >
          {[
            { title: t("RESULTS"), value: "Best in class" },
            { title: t("COMPETENCY"), value: "Creative" },
            { title: t("AWARDS"), value: "No awards yet" },
          ].map((item, index) => (
            <Box
              key={index}
              p="5"
              borderBottomWidth="1"
              borderColor={"coolGray.200"}
            >
              <Collapsible
                defaultCollapse
                header={item.title}
                body={
                  <Box pt="18px">
                    <Text fontWeight="500" fontSize="14px">
                      {item.value}
                    </Text>
                  </Box>
                }
              />
            </Box>
          ))}
        </Section>
        <Section
          title={t("NOTES_FEEDBACK_ON_STUDENT")}
          _box={{ mb: "4", roundedBottom: "xl", shadow: 2 }}
        >
          <Box p="5">
            <Collapsible
              defaultCollapse
              header={"NOTES"}
              body={
                <Box pt="18px">
                  <Text fontWeight="500" fontSize="14px" pb="30">
                    {"1 NOTE"}
                  </Text>
                  <Box bg={"gray.100"} rounded={"md"} p="4">
                    <VStack space={2}>
                      <HStack
                        justifyContent={"space-between"}
                        alignItems="center"
                      >
                        <Text bold>{t("Last day of school")}</Text>
                        <IconByName name="ellipsis-v" />
                      </HStack>
                      <Text>
                        {t(
                          "My wish for you is that you see the light in this world, in yourself, and in others. I see the light in you."
                        )}
                      </Text>
                    </VStack>
                  </Box>
                </Box>
              }
            />
          </Box>
        </Section>
      </Stack>
    </Layout>
  );
}

const Collapsible = ({
  header,
  body,
  defaultCollapse,
  isHeaderBold,
  _header,
  _icon,
  _box,
}) => {
  const [collaps, setCollaps] = useState(defaultCollapse);

  return (
    <>
      <Pressable onPress={() => setCollaps(!collaps)}>
        <Box>
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <Text
              fontSize={typeof isHeaderBold === "undefined" ? "14px" : ""}
              color="coolGray.400"
              fontWeight="500"
            >
              {header}
            </Text>
            <IconByName
              size="sm"
              isDisabled={true}
              color={!collaps ? "coolGray.400" : "coolGray.600"}
              name={!collaps ? "angle-double-down" : "angle-double-up"}
              {..._icon}
            />
          </HStack>
        </Box>
      </Pressable>
      <PresenceTransition visible={collaps}>{body}</PresenceTransition>
    </>
  );
};
