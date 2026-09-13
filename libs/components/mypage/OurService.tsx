import React, { ChangeEvent, useEffect, useState } from "react";
import type { NextPage } from "next";
import {
  Box,
  List,
  ListItem,
  Pagination,
  Stack,
  TableCell,
  TableRow,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { TabContext } from "@mui/lab";
import {
  sweetErrorHandling,
} from "../../../libs/sweetAlert";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_SERVICES_BY_ADMIN } from "../../../apollo/admin/query";
import { T } from "../../../libs/types/common";
import { ServicePanelList } from "../common/ServiceList";
import { REMOVE_SERVICE, UPDATE_SERVICE } from "../../../apollo/admin/mutation";
import { ServiceInquiry } from "../../types/service/service.input";
import { Service } from "../../types/service/service";
import { ServiceStatus } from "../../enums/service.enum";
import { ServiceUpdate } from "../../types/service/service.update";
import { useRouter } from "next/router";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTranslation } from "react-i18next";

const OurServiceList: NextPage = ({ initialInquiry, ...props }: any) => {
  const { t } = useTranslation("common");
  const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
  const [serviceInquiry, setServiceInquiry] =
    useState<ServiceInquiry>(initialInquiry);
  const [service, setService] = useState<Service[]>([]);
  const [serviceTotal, setServiceTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const router = useRouter();
  const [value, setValue] = useState(
    serviceInquiry?.serviceStatus ? serviceInquiry?.serviceStatus : "ALL"
  );

  /** APOLLO REQUESTS **/
  const [updateService] = useMutation(UPDATE_SERVICE);
  const [removeService] = useMutation(REMOVE_SERVICE);

  const {
    loading: getAllServicesByAdminLoading,
    data: getAllServicesByAdminData,
    error: getAllServicesByAdminError,
    refetch: getAllServicesByAdminRefetch,
  } = useQuery(GET_ALL_SERVICES_BY_ADMIN, {
    fetchPolicy: "network-only",
    variables: { input: serviceInquiry },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setService(data?.getAllServicesByAdmin?.list);
      setServiceTotal(data?.getAllServicesByAdmin?.metaCounter[0]?.total ?? 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (!router.isReady) return;

    if (router.query.input) {
      const inputObj = JSON.parse(router?.query?.input as string);

      setServiceInquiry(inputObj);
      setCurrentPage(inputObj.page ?? 1);
    }
  }, [router.isReady, router.query.input]);

  /** HANDLERS **/
  const menuIconClickHandler = (e: any, index: number) => {
    const tempAnchor = anchorEl.slice();
    tempAnchor[index] = e.currentTarget;
    setAnchorEl(tempAnchor);
  };

  const menuIconCloseHandler = () => {
    setAnchorEl([]);
  };

  const tabChangeHandler = async (event: any, newValue: string) => {
    setValue(newValue);

    let nextInquiry: ServiceInquiry = { ...serviceInquiry, page: 1 };

    if (newValue === "ACTIVE") {
      nextInquiry = { ...nextInquiry, serviceStatus: ServiceStatus.ACTIVE };
    } else if (newValue === "INACTIVE") {
      nextInquiry = { ...nextInquiry, serviceStatus: ServiceStatus.INACTIVE };
    } else {
      // All tab clears the status filter
      const { serviceStatus, ...rest } = nextInquiry;
      nextInquiry = { ...rest };
    }

    setServiceInquiry(nextInquiry);
  };

  const updateServiceHandler = async (updateData: ServiceUpdate) => {
    try {
      await updateService({
        variables: { input: updateData },
      });
      menuIconCloseHandler();
      await getAllServicesByAdminRefetch({ input: serviceInquiry });
    } catch (err: any) {
      menuIconCloseHandler();
      sweetErrorHandling(err).then();
    }
  };

  const paginationChangeHandler = async (
    event: ChangeEvent<unknown>,
    value: number
  ) => {
    const nextFilter = {
      ...serviceInquiry,
      page: value,
    };

    setServiceInquiry(nextFilter);
    setCurrentPage(value);

    const encoded = encodeURIComponent(JSON.stringify(nextFilter));
    router.replace(
      `/mypage?category=ourServices&input=${encoded}`,
      `/mypage?category=ourServices&input=${encoded}`,
      { scroll: false }
    );
  };

  return (
    <Stack className={"service-list"}>
      <Typography className={"tit"}>{t("Service List")}</Typography>
      <Box component={"div"} className={"table-wrap"}>
        <Box component={"div"} sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box component={"div"}>
              <List className={"tab-menu"}>
                <ListItem
                  onClick={(e: any) => tabChangeHandler(e, "ALL")}
                  value="ALL"
                  className={value === "ALL" ? "li on" : "li"}
                >
                  {t("All")}
                </ListItem>
                <ListItem
                  onClick={(e: any) => tabChangeHandler(e, "ACTIVE")}
                  value="ACTIVE"
                  className={value === "ACTIVE" ? "li on" : "li"}
                >
                  {t("Active")}
                </ListItem>
                <ListItem
                  onClick={(e: any) => tabChangeHandler(e, "INACTIVE")}
                  value="INACTIVE"
                  className={value === "INACTIVE" ? "li on" : "li"}
                >
                  {t("InActive")}
                </ListItem>
              </List>
              <Divider />
            </Box>
            {service.length === 0 ? (
              <TableRow>
                <TableCell align="center" colSpan={8}>
                  <span className={"no-data"}>
                    <InfoOutlinedIcon className="info-icon" />
                    <p>{t("data not found!")}</p>
                  </span>
                </TableCell>
              </TableRow>
            ) : (
              <ServicePanelList
                service={service}
                anchorEl={anchorEl}
                menuIconClickHandler={menuIconClickHandler}
                menuIconCloseHandler={menuIconCloseHandler}
                updateServiceHandler={updateServiceHandler}
              />
            )}
          </TabContext>
        </Box>
      </Box>
      {service.length > 0 && (
        <Stack className="pagination">
          <Pagination
            count={Math.ceil(serviceTotal / serviceInquiry.limit)}
            page={serviceInquiry.page}
            shape="circular"
            onChange={paginationChangeHandler}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#004034", // text color
                borderColor: "#004034", // border color
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "#C6D984", // selected background
                color: "#fff", // selected text
              },
              "& .MuiPaginationItem-root:hover": {
                backgroundColor: "#C6D984", // hover background
                color: "#fff",
              },
            }}
          />
          <Stack className="total-result">
            <Typography>
              {t("Total")} {serviceTotal} {serviceTotal > 1 ? t("services") : t("service")}{" "}
              {t("available")}
            </Typography>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

OurServiceList.defaultProps = {
  initialInquiry: {
    page: 1,
    limit: 10,
    text: "",
    serviceStatus: null,
  },
};

export default OurServiceList;
