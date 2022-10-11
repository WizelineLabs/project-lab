import { CardActionArea, CardContent, Card } from "@mui/material"
import EllipsisText from "app/core/components/EllipsisText"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import PersonIcon from "@mui/icons-material/Person"
import HelpIcon from "@mui/icons-material/Help"


import { ProposalCardWrap, ProposalCardLink } from "./ProposalCard.styles"

interface IProps {
  id: string | number
  title: string
  picture: string
  initials: string
  date: string
  description: string
  status: string
  color: any
  votesCount?: number | null
  skills?: { name: string }[]
  isOwner?: boolean
  tierName: String
  projectMembers?: number | null
}

export const ProposalCard = (props: IProps) => {
  const stopEvent = (event: React.MouseEvent<HTMLElement>) => event.stopPropagation()
  return (
    <>
      <Card
        sx={{
          width: 270,
          borderRadius: 5,
          "@media (max-width: 480px)": {
            width: "80vw",
          },
        }}
      >
        <CardActionArea style={{ height: "100%" }}>
          <ProposalCardLink to={`/projects/${props.id}`}>
            <CardContent style={{ backgroundColor: "#FFF", height: "100%", textDecoration: "none" }}>
              <ProposalCardWrap>
                <div className="ProposalCard__head">
                  <div className="ProposalCard__head__icon">
                    {props.picture ? (
                      <img src={props.picture} width="60" height="60" alt="Project" />
                    ) : (
                      <span>{props.initials}</span>
                    )}
                  </div>
                  <div className="ProposalCard__head__description">
                    <div className="ProposalCard__head__description--title">{props.title}</div>
                    <div className="ProposalCard__head__description--date">{props.date}</div>
                    <div className="ProposalCard__head__description--isOwner">
                      {props.isOwner && <p>Owner</p>}
                    </div>
                  </div>
                </div>
                <div className="ProposalCard--description">
                  <EllipsisText text={props.description || ""} length={65} />
                </div>
                <div className="ProposalCard__skills">
                  {props.skills &&
                    props.skills.map((skill) => (
                      <p key={skill.name} className="ProposalCard__skills--title">
                        {skill.name}
                      </p>
                    ))}
                </div>
                <div className="ProposalCard__status">
                  <hr />

                  <div>
                    <div>
                      <p className="ProposalCard__status--display">{props.status}</p>
                      <div className="ProposalCard__tier">
                        <a
                          href="https://wizeline.atlassian.net/wiki/spaces/wiki/pages/3075342381/Innovation+Tiers"
                          target="_blank"
                          rel="noreferrer"
                          onClick={stopEvent}
                        >
                          <label className="ProposalCard__head__description--tier">
                            {props.tierName}
                          </label>
                        </a>
                        <label
                          className="ProposalCard__head__description--tier--extra"
                          title="Maturation framework for innovation projects"
                        >
                          <HelpIcon sx={{ fontSize: 15 }} />
                        </label>
                      </div>
                    </div>
                    <div>
                      <div className="ProposalCard__status--like">
                        <p>{props.votesCount} </p>
                        <span>
                          <ThumbUpIcon sx={{ color: "#AF2E33", fontSize: 15 }} />
                        </span>
                      </div>
                      <div className="ProposalCard__status--members">
                        <p>{props.projectMembers} </p>
                        <span>
                          <PersonIcon sx={{ color: "#000000", fontSize: 15 }} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </ProposalCardWrap>
            </CardContent>
          </ProposalCardLink>
        </CardActionArea>
      </Card>
    </>
  )
}
export default ProposalCard
