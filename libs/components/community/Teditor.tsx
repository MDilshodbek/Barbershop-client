import React, { useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Stack,
  Typography,
  Select,
  TextField,
} from "@mui/material";
import { BoardArticleCategory } from "../../enums/board-article.enum";
import { Editor } from "@toast-ui/react-editor";
import { getJwtToken } from "../../auth";
import { REACT_APP_API_URL } from "../../config";
import { useRouter } from "next/router";
import axios from "axios";
import { T } from "../../types/common";
import "@toast-ui/editor/dist/toastui-editor.css";
import { useMutation } from "@apollo/client";
import { CREATE_BOARD_ARTICLE } from "../../../apollo/user/mutation";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../../sweetAlert";
import { Message } from "../../enums/common.enum";
import { useTranslation } from "react-i18next";
import useDeviceDetect from "../../hooks/useDeviceDetect";

const TuiEditor = () => {
  const { t } = useTranslation("common");
  const device = useDeviceDetect();
  const editorRef = useRef<Editor>(null),
    token = getJwtToken(),
    router = useRouter();
  const [articleCategory, setArticleCategory] = useState<BoardArticleCategory>(
    BoardArticleCategory.FREE
  );

  const [articleTitle, setArticleTitle] = useState<string>("");
  const [articleContent, setArticleContent] = useState<string>("");
  const [articleImage, setArticleImage] = useState<string>("");

  /** APOLLO REQUESTS **/
  const [createBoardArticle] = useMutation(CREATE_BOARD_ARTICLE);

  // const memoizedValues = useMemo(() => {
  //   const articleTitle = "",
  //     articleContent = "",
  //     articleImage = "";

  //   return { articleTitle, articleContent, articleImage };
  // }, []);

  /** HANDLERS **/

  const uploadImage = async (image: any) => {
    try {
      const formData = new FormData();
      formData.append(
        "operations",
        JSON.stringify({
          query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
				  }`,
          variables: {
            file: null,
            target: "article",
          },
        })
      );
      formData.append(
        "map",
        JSON.stringify({
          "0": ["variables.file"],
        })
      );
      formData.append("0", image);

      const response = await axios.post(
        `${process.env.REACT_APP_API_GRAPHQL_URL}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "apollo-require-preflight": true,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseImage = response.data.data.imageUploader;
      setArticleImage(responseImage);

      return `${REACT_APP_API_URL}/${responseImage}`;
    } catch (err) {
      console.log("Error, uploadImage:", err);
    }
  };

  const changeCategoryHandler = (e: any) => {
    setArticleCategory(e.target.value);
  };

  const articleTitleHandler = (e: T) => {
    setArticleTitle(e.target.value);
  };

  const handleRegisterButton = async () => {
    try {
      const editor = editorRef.current;
      const articleContent = editor?.getInstance().getHTML() as string;
      setArticleContent(articleContent);

      if (!articleContent.trim() && !articleTitle.trim()) {
        throw new Error(Message.INSERT_ALL_INPUTS);
      }

      await createBoardArticle({
        variables: {
          input: {
            articleTitle,
            articleContent,
            articleImage,
            articleCategory,
          },
        },
      });

      await sweetTopSuccessAlert(t("Article is created successfully"), 700);
      await router.push({
        pathname: "/mypage",
        query: {
          category: "myArticles",
        },
      });
    } catch (error: any) {
      sweetErrorHandling(new Error(Message.INSERT_ALL_INPUTS)).then();
    }
  };

  const doDisabledCheck = () => {
    return !articleContent.trim() && !articleTitle.trim();
  };

  return (
    <Stack>
      <Stack
        direction={device === "mobile" ? "column" : "row"}
        style={{ margin: device === "mobile" ? "16px" : "40px", gap: device === "mobile" ? "16px" : 0 }}
        justifyContent="space-evenly"
      >
        <Box
          component={"div"}
          className={"form_row"}
          style={{ width: device === "mobile" ? "100%" : "300px" }}
        >
          <Typography style={{ color: "#7f838d", margin: "10px" }} variant="h3">
            {t("Category")}
          </Typography>
          <FormControl
            sx={{
              width: "100%",
              background: "white",
            }}
          >
            <Select
              value={articleCategory}
              onChange={changeCategoryHandler}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value={BoardArticleCategory.FREE}>
                <span>{t("Free")}</span>
              </MenuItem>
              <MenuItem value={BoardArticleCategory.LIFESTYLE}>
                {t("Lifestyle")}
              </MenuItem>
              <MenuItem value={BoardArticleCategory.NEWS}>{t("News")}</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box
          component={"div"}
          style={{ width: device === "mobile" ? "100%" : "300px", flexDirection: "column" }}
        >
          <Typography style={{ color: "#7f838d", margin: "10px" }} variant="h3">
            {t("Title")}
          </Typography>
          <TextField
            onChange={articleTitleHandler}
            id="filled-basic"
            sx={{
              width: "100%",
              maxWidth: device === "mobile" ? "100%" : "300px",
              background: "white",
            }}
          />
        </Box>
      </Stack>

      <Editor
        initialValue={t("Type here")}
        placeholder={t("Type here")}
        previewStyle={device === "mobile" ? "tab" : "vertical"}
        height={device === "mobile" ? "480px" : "640px"}
        // @ts-ignore
        initialEditType={"WYSIWYG"}
        toolbarItems={[
          ["heading", "bold", "italic", "strike"],
          ["image", "table", "link"],
          ["ul", "ol", "task"],
        ]}
        ref={editorRef}
        hooks={{
          addImageBlobHook: async (image: any, callback: any) => {
            const uploadedImageURL = await uploadImage(image);
            callback(uploadedImageURL);
            return false;
          },
        }}
        events={{
          load: function (param: any) {},
        }}
      />

      <Stack direction="row" justifyContent="center">
        <Button
          variant="contained"
          sx={{
            margin: "30px",
            width: device === "mobile" ? "100%" : "250px",
            maxWidth: device === "mobile" ? "320px" : "250px",
            height: "45px",
            backgroundColor: "#004034 !important",
            color: "#fff !important",
            cursor: "pointer !important",
          }}
          onClick={handleRegisterButton}
          disabled={doDisabledCheck()}
        >
          {t("Publish")}
        </Button>
      </Stack>
    </Stack>
  );
};

export default TuiEditor;
