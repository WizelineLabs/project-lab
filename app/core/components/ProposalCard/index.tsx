import {
  ProposalCardSkills,
  ProposalCardStatus,
  ProposalCardWrap,
} from "./ProposalCard.styles";
import {
  Help as HelpIcon,
  Person as PersonIcon,
  ThumbUp as ThumbUpIcon,
} from "@mui/icons-material";
import {
  CardActionArea,
  CardContent,
  Card,
  Chip,
  Link,
  useMediaQuery,
  CardActions,
} from "@mui/material";
import { useNavigate } from "@remix-run/react";
import EllipsisText from "app/core/components/EllipsisText";
import { useOptionalUser } from "~/utils";

interface IProps {
  id: string | number;
  title: string;
  picture?: string;
  initials?: string;
  date: string;
  description: string;
  status: string;
  color?: string;
  votesCount?: number | null;
  skills?: { name: string }[];
  isOwner?: boolean;
  tierName?: string;
  projectMembers?: number | null;
}

export const ProposalCard = (props: IProps) => {
  const navigate = useNavigate();
  const stopEvent = (event: React.MouseEvent<HTMLElement>) =>
    event.stopPropagation();

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const user = useOptionalUser();

  const handleCardClick = () => {
    if (user) {
      if (user.role === "ADMIN" || user.role === "USER") {
        navigate(`/projects/${props.id}`);
      } else {
        navigate(`/internshipProjects/${props.id}`);
      }
    } else {
      navigate(`/internshipProjects/${props.id}`);
    }
  };
  const show = user?.role === "ADMIN" || user?.role === "USER";

  return (
    <>
      <Card>
        <CardActionArea sx={{ height: "100%" }}>
          <CardContent onClick={handleCardClick}>
            <ProposalCardWrap>
              <div className="ProposalCard__head">
                {user && show ? (
                  <div className="ProposalCard__head__icon">
                    {props.picture ? (
                      <img
                        src={props.picture}
                        width="60"
                        height="60"
                        alt="Project"
                      />
                    ) : (
                      <span>{props.initials}</span>
                    )}
                  </div>
                ) : null}
                <div className="ProposalCard__head__description">
                  <div className="ProposalCard__head__description--title">
                    {props.title}
                  </div>
                  <div className="ProposalCard__head__description--date">
                    {props.date}
                  </div>
                  <div className="ProposalCard__head__description--isOwner">
                    {props.isOwner ? <p>Owner</p> : null}
                  </div>
                </div>
              </div>
              <EllipsisText text={props.description || ""} length={200} />
            </ProposalCardWrap>
          </CardContent>
          <CardActions
            sx={{
              display: "flex",
              alignItems: "baseline",
              flexDirection: "column",
              cursor: "auto",
            }}
          >
            <ProposalCardSkills>
              {props.skills && props.skills[0].name != ""
                ? props.skills.map((skill) => (
                    <Chip
                      key={skill.name}
                      component="a"
                      label={skill.name}
                      sx={{ marginRight: 1, marginBottom: 1 }}
                      clickable
                      href={`/projects?&skill=${skill.name.trim()}`}
                    />
                  ))
                : null}
            </ProposalCardSkills>
            {user && show ? (
              <ProposalCardStatus>
                <div>
                  <div>
                    <span className="ProposalCard__status--display">
                      {props.status}
                    </span>
                    <div className="ProposalCard__tier">
                      <Link
                        href="https://wizeline.atlassian.net/wiki/spaces/wiki/pages/3075342381/Innovation+Tiers"
                        target="_blank"
                        rel="noreferrer"
                        onClick={stopEvent}
                        underline="hover"
                      >
                        {props.tierName}
                      </Link>
                      <span
                        className="ProposalCard__head__description--tier--extra"
                        title="Maturation framework for innovation projects"
                      >
                        <HelpIcon
                          sx={{
                            width: "17px",
                            height: "17px",
                            color: prefersDarkMode ? "#7f7c7c" : "#00000066",
                            marginLeft: "5px",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                  <div className="ProposalCard__status">
                    <div className="ProposalCard__status--icons">
                      <ThumbUpIcon
                        sx={{
                          color: prefersDarkMode ? "#999999" : "#00000066",
                          width: "20px",
                          height: "20px",
                          marginRight: "3px",
                        }}
                      />
                      <div className="ProposalCard__display">
                        <span>{props.votesCount}</span>
                      </div>
                    </div>
                    <div className="ProposalCard__status--icons">
                      <PersonIcon
                        sx={{
                          color: prefersDarkMode ? "#999999" : "#00000066",
                          width: "23px",
                          height: "23px",
                          marginRight: "-3px",
                        }}
                      />
                      <div className="ProposalCard__display">
                        <span>{props.projectMembers}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ProposalCardStatus>
            ) : null}
          </CardActions>
        </CardActionArea>
      </Card>
    </>
  );
};
export default ProposalCard;
