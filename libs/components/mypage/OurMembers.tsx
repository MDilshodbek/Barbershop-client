import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import {
  Box,
  InputAdornment,
  List,
  ListItem,
  Pagination,
  Stack,
  TableCell,
  TableRow,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { TabContext } from "@mui/lab";
import OutlinedInput from "@mui/material/OutlinedInput";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { MembersInquiry } from "../../../libs/types/member/member.input";
import { Member } from "../../../libs/types/member/member";
import { MemberStatus, MemberType } from "../../../libs/enums/member.enum";
import { sweetErrorHandling } from "../../../libs/sweetAlert";
import { MemberUpdate } from "../../../libs/types/member/member.update";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_MEMBER_BY_ADMIN } from "../../../apollo/admin/mutation";
import { GET_ALL_MEMBERS_BY_ADMIN } from "../../../apollo/admin/query";
import { T } from "../../../libs/types/common";
import { MemberPanelList } from "../common/MemberList";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useRouter } from "next/router";

const OurMemberList: NextPage = ({ initialInquiry, ...props }: any) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
  const [membersInquiry, setMembersInquiry] =
    useState<MembersInquiry>(initialInquiry);
  const [members, setMembers] = useState<Member[]>([]);
  const [membersTotal, setMembersTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [value, setValue] = useState(
    membersInquiry?.search?.memberStatus
      ? membersInquiry?.search?.memberStatus
      : "ALL"
  );
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("ALL");

  /** APOLLO REQUESTS **/
  const [updateMemberByAdmin] = useMutation(UPDATE_MEMBER_BY_ADMIN);

  const {
    loading: getAllMembersByAdminLoading,
    data: getAllMembersByAdminData,
    error: getAllMembersByAdminError,
    refetch: getAllMembersByAdminRefetch,
  } = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
    fetchPolicy: "network-only",
    variables: { input: membersInquiry },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setMembers(data?.getAllMembersByAdmin?.list);
      setMembersTotal(data?.getAllMembersByAdmin?.metaCounter[0]?.total ?? 0);
    },
  });
  /** LIFECYCLES **/
  useEffect(() => {
    if (!router.isReady) return;

    if (router.query.input) {
      const inputObj = JSON.parse(router?.query?.input as string);

      setMembersInquiry(inputObj);
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
    setSearchText("");

    setMembersInquiry({ ...membersInquiry, page: 1, sort: "createdAt" });

    switch (newValue) {
      case "ACTIVE":
        setMembersInquiry({
          ...membersInquiry,
          search: { memberStatus: MemberStatus.ACTIVE },
        });
        break;
      case "BLOCK":
        setMembersInquiry({
          ...membersInquiry,
          search: { memberStatus: MemberStatus.BLOCK },
        });
        break;
      case "DELETE":
        setMembersInquiry({
          ...membersInquiry,
          search: { memberStatus: MemberStatus.DELETE },
        });
        break;
      default:
        delete membersInquiry?.search?.memberStatus;
        setMembersInquiry({ ...membersInquiry });
        break;
    }
  };

  const updateMemberHandler = async (updateData: MemberUpdate) => {
    try {
      await updateMemberByAdmin({
        variables: {
          input: updateData,
        },
      });

      menuIconCloseHandler();
      await getAllMembersByAdminRefetch({ input: membersInquiry });
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  const textHandler = useCallback((value: string) => {
    try {
      setSearchText(value);
    } catch (err: any) {
      console.log("textHandler: ", err.message);
    }
  }, []);

  const searchTextHandler = () => {
    try {
      setMembersInquiry({
        ...membersInquiry,
        search: {
          ...membersInquiry.search,
          text: searchText,
        },
      });
    } catch (err: any) {
      console.log("searchTextHandler: ", err.message);
    }
  };

  const searchTypeHandler = async (newValue: string) => {
    try {
      setSearchType(newValue);

      if (newValue !== "ALL") {
        setMembersInquiry({
          ...membersInquiry,
          page: 1,
          sort: "createdAt",
          search: {
            ...membersInquiry.search,
            memberType: newValue as MemberType,
          },
        });
      } else {
        delete membersInquiry?.search?.memberType;
        setMembersInquiry({ ...membersInquiry });
      }
    } catch (err: any) {
      console.log("searchTypeHandler: ", err.message);
    }
  };

  const paginationChangeHandler = async (
    event: ChangeEvent<unknown>,
    value: number
  ) => {
    const nextFilter = {
      ...membersInquiry,
      page: value,
    };

    setMembersInquiry(nextFilter);
    setCurrentPage(value);

    const encoded = encodeURIComponent(JSON.stringify(nextFilter));
    router.replace(
      `/mypage?category=ourMembers&input=${encoded}`,
      `/mypage?category=ourMembers&input=${encoded}`,
      { scroll: false }
    );
  };

  return (
    <Stack className={"service-list"}>
      <Typography className={"tit"}>Member List</Typography>
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
                  All
                </ListItem>
                <ListItem
                  onClick={(e: any) => tabChangeHandler(e, "ACTIVE")}
                  value="ACTIVE"
                  className={value === "ACTIVE" ? "li on" : "li"}
                >
                  Active
                </ListItem>
                <ListItem
                  onClick={(e: any) => tabChangeHandler(e, "BLOCK")}
                  value="BLOCK"
                  className={value === "BLOCK" ? "li on" : "li"}
                >
                  Blocked
                </ListItem>
                <ListItem
                  onClick={(e: any) => tabChangeHandler(e, "DELETE")}
                  value="DELETE"
                  className={value === "DELETE" ? "li on" : "li"}
                >
                  Deleted
                </ListItem>
              </List>
              <Divider />
              <Stack className={"search-area"} sx={{ m: "24px" }}>
                <OutlinedInput
                  value={searchText}
                  onChange={(e: any) => textHandler(e.target.value)}
                  sx={{ width: "100%" }}
                  className={"search"}
                  placeholder="Search user name"
                  onKeyDown={(event) => {
                    if (event.key == "Enter") searchTextHandler();
                  }}
                  endAdornment={
                    <>
                      {searchText && (
                        <CancelRoundedIcon
                          style={{ cursor: "pointer" }}
                          onClick={async () => {
                            setSearchText("");
                            setMembersInquiry({
                              ...membersInquiry,
                              search: {
                                ...membersInquiry.search,
                                text: "",
                              },
                            });
                          }}
                        />
                      )}
                      <InputAdornment
                        position="end"
                        onClick={() => searchTextHandler()}
                      >
                        <img
                          src="/img/icons/search_icon.png"
                          alt={"searchIcon"}
                        />
                      </InputAdornment>
                    </>
                  }
                />
                <Select sx={{ width: "160px", ml: "20px" }} value={searchType}>
                  <MenuItem
                    value={"ALL"}
                    onClick={() => searchTypeHandler("ALL")}
                  >
                    All
                  </MenuItem>
                  <MenuItem
                    value={"USER"}
                    onClick={() => searchTypeHandler("USER")}
                  >
                    User
                  </MenuItem>
                  <MenuItem
                    value={"BARBER"}
                    onClick={() => searchTypeHandler("BARBER")}
                  >
                    Barber
                  </MenuItem>
                  <MenuItem
                    value={"ADMIN"}
                    onClick={() => searchTypeHandler("ADMIN")}
                  >
                    Admin
                  </MenuItem>
                </Select>
              </Stack>
              <Divider />
            </Box>
            {members.length === 0 ? (
              <TableRow>
                <TableCell align="center" colSpan={8}>
                  <span className={"no-data"}>
                    <InfoOutlinedIcon className="info-icon" />
                    <p>data not found!</p>
                  </span>
                </TableCell>
              </TableRow>
            ) : (
              <MemberPanelList
                members={members}
                anchorEl={anchorEl}
                menuIconClickHandler={menuIconClickHandler}
                menuIconCloseHandler={menuIconCloseHandler}
                updateMemberHandler={updateMemberHandler}
              />
            )}
          </TabContext>
        </Box>
      </Box>
      {members.length > 0 && (
        <Stack className="pagination">
          <Pagination
            count={Math.ceil(membersTotal / membersInquiry.limit)}
            page={membersInquiry.page}
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
              Total {membersTotal} member{membersTotal > 1 ? "s" : ""}{" "}
              available
            </Typography>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

OurMemberList.defaultProps = {
  initialInquiry: {
    page: 1,
    limit: 10,
    sort: "createdAt",
    search: {},
  },
};

export default OurMemberList;
