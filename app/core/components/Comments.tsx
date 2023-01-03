import { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Box,
  Avatar,
  Link,
  Paper,
} from "@mui/material";
import { z } from "zod";

import type { getComments } from "~/models/comment.server";
import { zfd } from "zod-form-data";
import { withZod } from "@remix-validated-form/with-zod";
import ModalBox from "./ModalBox";
import { Form, useTransition } from "@remix-run/react";
import TextEditor from "./TextEditor";
import { ValidatedForm } from "remix-validated-form";
import Markdown from "marked-react";
import type { Comments as CommentType, Profiles } from "@prisma/client";

type CommentsArrayType = Awaited<ReturnType<typeof getComments>>;
type CommentItemType = CommentType & {
  author?: Profiles;
  children?: CommentType[];
};

export const validator = withZod(
  zfd.formData({
    body: z.string().min(1),
    parentId: z.string().optional().nullable(),
    id: z.string().optional(),
  })
);

export default function Comments({
  comments,
  projectId,
  profileId,
}: {
  comments: CommentsArrayType;
  projectId: string;
  profileId: string;
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
        <input type="hidden" name="projectId" value={projectId} />
        <br />
        <Button type="submit" variant="contained">
          Add a comment
        </Button>
      </ValidatedForm>
      {comments &&
        comments
          .filter((comment) => !comment.parentId)
          .map((comment) => {
            return (
              <CommentItem
                key={comment.id}
                comment={comment}
                projectId={projectId}
                profileId={profileId}
              />
            );
          })}
    </Box>
  );
}

function CommentItem({
  comment,
  projectId,
  profileId,
}: {
  comment: CommentItemType;
  projectId: string;
  profileId: string;
}) {
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openEditComment, setOpenEditComment] = useState<boolean>(false);

  const transition = useTransition();
  useEffect(() => {
    if (transition.type == "actionRedirect") {
      setOpenDeleteModal(false);
      setOpenEditComment(false);
    }
  }, [transition]);

  return (
    <Paper sx={{ padding: 2, marginY: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Avatar alt={"alt"} src={comment.author?.avatarUrl ?? ""}></Avatar>
        </Grid>
        <Grid justifyContent="left" item xs zeroMinWidth>
          <Typography variant="body1">{`${comment.author?.firstName} ${comment.author?.lastName}`}</Typography>
          <Typography variant="body2">
            {comment.updatedAt.toLocaleString()}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Markdown>{comment.body}</Markdown>
            {profileId === comment.authorId && (
              <Box>
                <Link
                  component="button"
                  onClick={() => setOpenEditComment(true)}
                >
                  Edit
                </Link>
                &nbsp;
                <Link
                  component="button"
                  onClick={() => setOpenDeleteModal(true)}
                >
                  Delete
                </Link>
              </Box>
            )}
          </Box>
          {comment.children &&
            comment.children.map((commentChild) => {
              return (
                <CommentItem
                  key={commentChild.id}
                  comment={commentChild}
                  projectId={projectId}
                  profileId={profileId}
                />
              );
            })}
          {!comment.parentId && (
            <ValidatedForm
              action={`./comment/create`}
              method="post"
              validator={validator}
              resetAfterSubmit
            >
              <TextEditor name="body" height={100} />
              <input type="hidden" name="parentId" value={comment.id} />
              <input type="hidden" name="projectId" value={projectId} />
              <br />
              <Button type="submit" variant="contained">
                Reply
              </Button>
            </ValidatedForm>
          )}
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
          <input type="hidden" name="projectId" value={projectId} />
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
