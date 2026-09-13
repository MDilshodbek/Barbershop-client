import React from "react";
import Link from "next/link";
import {
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  Table,
  TableContainer,
  Button,
  Menu,
  Fade,
  MenuItem,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Service } from "../../types/service/service";
import { REACT_APP_API_URL } from "../../config";
import { ServiceStatus } from "../../enums/service.enum";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTranslation } from "react-i18next";

interface Data {
  id: string;
  title: string;
  price: string;
  duration: string;
  type: string;
  status: string;
}

type Order = "asc" | "desc";

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "id",
    numeric: true,
    disablePadding: false,
    label: "DB ID",
  },
  {
    id: "title",
    numeric: true,
    disablePadding: false,
    label: "TITLE",
  },
  {
    id: "price",
    numeric: false,
    disablePadding: false,
    label: "PRICE",
  },
  {
    id: "duration",
    numeric: false,
    disablePadding: false,
    label: "DURATION",
  },
  {
    id: "type",
    numeric: false,
    disablePadding: false,
    label: "TYPE",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "STATUS",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    service: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick } = props;
  const { t } = useTranslation("common");

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "left" : "center"}
            padding={headCell.disablePadding ? "none" : "normal"}
          >
            {t(headCell.label)}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface ServicePanelListType {
  service: Service[];
  anchorEl: any;
  menuIconClickHandler: any;
  menuIconCloseHandler: any;
  updateServiceHandler: any;
}

export const ServicePanelList = (props: ServicePanelListType) => {
  const { t } = useTranslation("common");
  const {
    service,
    anchorEl,
    menuIconClickHandler,
    menuIconCloseHandler,
    updateServiceHandler,
  } = props;

  return (
    <Stack>
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={"medium"}
        >
          {/*@ts-ignore*/}
          <EnhancedTableHead />
          <TableBody>
            {service.length !== 0 &&
              service.map((service: Service, index: number) => {
                const serviceImage = `${REACT_APP_API_URL}/${service?.serviceImages[0]}`;

                return (
                  <TableRow
                    hover
                    key={service?._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">{service._id}</TableCell>
                    <TableCell align="left" className={"name"}>
                      <Stack direction={"row"} style={{ alignItems: "center" }}>
                        <div>
                          <Avatar
                            alt={t("Service photo")}
                            src={serviceImage}
                            sx={{ ml: "2px", mr: "10px" }}
                          />
                        </div>
                        <div>{service.serviceTitle}</div>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">{service.servicePrice}</TableCell>
                    <TableCell align="center">
                      {service.serviceDuration}
                    </TableCell>
                    <TableCell align="center">{service.serviceType}</TableCell>
                    <TableCell align="center">
                      {service.serviceStatus === ServiceStatus.INACTIVE && (
                        <Button className={"badge warning"}>
                          {service.serviceStatus}
                        </Button>
                      )}

                      {service.serviceStatus === ServiceStatus.ACTIVE && (
                        <>
                          <Button
                            onClick={(e: any) => menuIconClickHandler(e, index)}
                            className={"badge success"}
                          >
                            {service.serviceStatus}
                          </Button>

                          <Menu
                            className={"menu-modal"}
                            MenuListProps={{
                              "aria-labelledby": "fade-button",
                            }}
                            anchorEl={anchorEl[index]}
                            open={Boolean(anchorEl[index])}
                            onClose={menuIconCloseHandler}
                            TransitionComponent={Fade}
                            sx={{ p: 1 }}
                          >
                            {Object.values(ServiceStatus)
                              .filter((ele) => ele !== service.serviceStatus)
                              .map((status: string) => (
                                <MenuItem
                                  onClick={() =>
                                    updateServiceHandler({
                                      _id: service._id,
                                      serviceStatus: status,
                                    })
                                  }
                                  key={status}
                                >
                                  <Typography
                                    variant={"subtitle1"}
                                    component={"span"}
                                  >
                                    {status}
                                  </Typography>
                                </MenuItem>
                              ))}
                          </Menu>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
