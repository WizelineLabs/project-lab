import {
  CardActionArea,
  CardContent,
  Card,
  Chip,
  Link,
  useMediaQuery,
} from "@mui/material";
import EllipsisText from "app/core/components/EllipsisText";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import PersonIcon from "@mui/icons-material/Person";
import HelpIcon from "@mui/icons-material/Help";
import { ProposalCardWrap } from "./ProposalCard.styles";
import { useNavigate } from "@remix-run/react";
import { useOptionalUser } from "~/utils";

interface IProps {
  id: string | number;
  title: string;
  picture?: string;
  initials?: string;
  date: string;
  description: string;
  status: string;
  color: any;
  votesCount?: number | null;
  skills?: { name: string }[];
  isOwner?: boolean;
  tierName?: String;
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
        <CardActionArea sx={{ height: "100%" }} onClick={handleCardClick}>
          <CardContent>
            <ProposalCardWrap>
              <div className="ProposalCard__head">
                {user && show && (
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
                )}
                <div className="ProposalCard__head__description">
                  <div className="ProposalCard__head__description--title">
                    {props.title}
                  </div>
                  <div className="ProposalCard__head__description--date">
                    {props.date}
                  </div>
                  <div className="ProposalCard__head__description--isOwner">
                    {props.isOwner && <p>Owner</p>}
                  </div>
                </div>
              </div>
              <EllipsisText text={props.description || ""} length={200} />
              <div className="ProposalCard__skills">
                {props.skills &&
                  props.skills[0].name != "" &&
                  props.skills.map((skill) => (
                    <Chip
                      key={skill.name}
                      label={skill.name}
                      sx={{ marginRight: 1, marginBottom: 1 }}
                    />
                  ))}
              </div>
              {user && show && (
                <div className="ProposalCard__status">
                  <hr />

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
                          <label className="ProposalCard__head__description--tier">
                            {props.tierName}
                          </label>
                        </Link>
                        <label
                          className="ProposalCard__head__description--tier--extra"
                          title="Maturation framework for innovation projects"
                        >
                          <HelpIcon />
                        </label>
                      </div>
                    </div>
                    <div>
                      <div className="ProposalCard__status--like">
                        <span
                          style={{
                            color: prefersDarkMode ? "#FFFF" : "#111823",
                          }}
                        >
                          {props.votesCount}{" "}
                        </span>
                        <span>
                          <ThumbUpIcon
                            sx={{
                              color: prefersDarkMode ? "#FFFF" : "#111823",
                            }}
                          />
                        </span>
                      </div>
                      <div className="ProposalCard__status--members">
                        <span>{props.projectMembers} </span>
                        <span>
                          <PersonIcon />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ProposalCardWrap>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
};
export default ProposalCard;
