import ModalBox from "../ModalBox";
import TextEditor from "../TextEditor";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import {
  Grid,
  Typography,
  Button,
  Box,
  Avatar,
  Paper,
  IconButton,
} from "@mui/material";
import { Form, useNavigation } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import Markdown from "marked-react";
import { useEffect, useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";
import type { getCommentsApplicant } from "~/models/applicantComment.server";
import { validateNavigationRedirect } from "~/utils";

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
type CommentsArrayType = Awaited<ReturnType<typeof getCommentsApplicant>>;
type CommentItemType = Optional<CommentsArrayType[number], "children">;

export const validator = withZod(
  zfd.formData({
    body: z.string().min(1),
    parentId: z.string().optional().nullable(),
    id: z.string().optional(),
  })
);

export default function AplicantComments({
  comments,
  applicantId,
  profileId,
}: {
  comments: CommentsArrayType;
  applicantId: number;
  profileId: string | undefined;
}) {
  return (
    <Box sx={{ marginTop: 2, marginBottom: 2 }}>
      <h3>Comments</h3>
      <ValidatedForm
        action="./comment/create"
        method="post"
        validator={validator}
        resetAfterSubmit
      >
        <TextEditor name="body" height={100} />
        <input type="hidden" name="applicantId" value={applicantId} />
        <br />
        <Button type="submit" variant="contained">
          Add a comment
        </Button>
      </ValidatedForm>
      {comments
        ? comments
            .filter((comment) => !comment.parentId)
            .map((comment) => {
              return (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  applicantId={applicantId}
                  profileId={profileId}
                />
              );
            })
        : null}
    </Box>
  );
}

function CommentItem({
  comment,
  applicantId,
  profileId,
}: {
  comment: CommentItemType;
  applicantId: number;
  profileId: string | undefined;
}) {
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openEditComment, setOpenEditComment] = useState<boolean>(false);

  const navigation = useNavigation();
  useEffect(() => {
    const isActionRedirect = validateNavigationRedirect(navigation);
    if (isActionRedirect) {
      setOpenDeleteModal(false);
      setOpenEditComment(false);
    }
  }, [navigation]);

  return (
    <Paper sx={{ padding: 2, marginY: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Avatar alt={"alt"} src={comment.authorAvatarUrl ?? ""}></Avatar>
        </Grid>
        <Grid justifyContent="left" item xs zeroMinWidth>
          <Typography variant="body1">{`${comment.authorPreferredName} ${comment.authorLastName}`}</Typography>
          <Typography variant="body2">
            {comment.updatedAt.toLocaleString()}
          </Typography>
        </Grid>
        {profileId === comment.authorId ? (
          <Grid item justifyContent="right">
            <IconButton
              color="warning"
              aria-label="delete"
              onClick={() => setOpenDeleteModal(true)}
            >
              <Delete />
            </IconButton>
            <IconButton
              aria-label="edit"
              color="primary"
              onClick={() => setOpenEditComment(true)}
            >
              <Edit />
            </IconButton>
          </Grid>
        ) : null}
        <Grid item xs={12}>
          <Box>
            <Markdown>{comment.body}</Markdown>
          </Box>
          {comment.children
            ? comment.children.map((commentChild) => {
                return (
                  <CommentItem
                    key={commentChild.id}
                    comment={commentChild}
                    applicantId={applicantId}
                    profileId={profileId}
                  />
                );
              })
            : null}
          {!comment.parentId ? (
            <ValidatedForm
              action={`./comment/create`}
              method="post"
              validator={validator}
              resetAfterSubmit
            >
              <TextEditor name="body" height={100} />
              <input type="hidden" name="parentId" value={comment.id} />
              <input type="hidden" name="applicantId" value={applicantId} />
              <br />
              <Button type="submit" variant="contained">
                Reply
              </Button>
            </ValidatedForm>
          ) : null}
        </Grid>
      </Grid>
      <ModalBox open={openDeleteModal} close={() => setOpenDeleteModal(false)}>
        <h2>Are you sure you want to delete this comment?</h2>
        <p>This action cannot be undone.</p>
        <Form action={`./comment/${comment.id}`} method="delete">
          <Button variant="contained" onClick={() => setOpenDeleteModal(false)}>
            Cancel
          </Button>
          &nbsp;
          <Button type="submit" variant="contained" color="warning">
            Delete
          </Button>
        </Form>
      </ModalBox>
      <ModalBox open={openEditComment} close={() => setOpenEditComment(false)}>
        <ValidatedForm
          action={`./comment/${comment.id}`}
          method="post"
          validator={validator}
          defaultValues={comment}
        >
          <h2>Edit your comment</h2>
          <TextEditor name="body" height={100} />
          <input type="hidden" name="parentId" value={comment.parentId || ""} />
          <input type="hidden" name="applicantId" value={applicantId} />
          <Box sx={{ marginTop: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              type="reset"
              onClick={() => {
                setOpenEditComment(false);
              }}
            >
              Cancel
            </Button>
            &nbsp;
            <Button variant="contained" type="submit">
              Save
            </Button>
          </Box>
        </ValidatedForm>
      </ModalBox>
    </Paper>
  );
}
