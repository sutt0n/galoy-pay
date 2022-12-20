import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import originalUrl from "original-url"
import ReactToPrint from "react-to-print"
import { bech32 } from "bech32"
import { QRCode } from "react-qrcode-logo"
import { useRef } from "react"

export async function getServerSideProps({
  req,
  params: { username },
}: {
  req: unknown
  params: { username: string }
}) {
  const url = originalUrl(req)

  const lnurl = bech32.encode(
    "lnurl",
    bech32.toWords(
      Buffer.from(
        `${url.protocol}//${url.hostname}/.well-known/lnurlp/${username}`,
        "utf8",
      ),
    ),
    1500,
  )

  // Note: add the port to the webURL for local development
  const webURL = `${url.protocol}//${url.hostname}/${username}`

  const qrCodeURL = (webURL + "?lightning=" + lnurl).toUpperCase()

  return {
    props: {
      qrCodeURL,
      username,
      userHeader: `${username}'s paycode`,
    },
  }
}

export default function ({
  qrCodeURL,
  username,
  userHeader,
}: {
  lightningAddress: string
  qrCodeURL: string
  username: string
  userHeader: string
}) {
  const componentRef = useRef<HTMLDivElement | null>(null)

  return (
    <>
      <div style={{ display: "none" }}>
        <Container fluid ref={componentRef}>
          <br />
          <Row className="justify-content-md-center">
            <Col md="auto">
              <Card className="text-center">
                <Card.Body>
                  <Card.Text>
                    <span className="user-header">{userHeader}</span>
                    <p>
                      {`Display this static QR code online or in person to allow anybody to
                    pay ${username.toLowerCase()}.`}
                    </p>
                    <QRCode
                      ecLevel="H"
                      value={qrCodeURL}
                      size={800}
                      logoImage="/BBW-QRLOGO.png"
                      logoWidth={250}
                    />
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <br />
        </Container>
      </div>
      <Container fluid>
        <br />
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Card className="text-center">
              <Card.Body>
                <Card.Text>
                  <span className="user-header">{userHeader}</span>
                  <p>
                    {`Display this static QR code online or in person to allow anybody to
                    pay ${username.toLowerCase()}.`}
                  </p>
                  <QRCode
                    ecLevel="H"
                    value={qrCodeURL}
                    size={300}
                    logoImage="/BBW-QRLOGO.png"
                    logoWidth={100}
                  />
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <br />
      </Container>
      <Row className="justify-content-center">
        <ReactToPrint
          trigger={() => <Button>Print QR Code</Button>}
          content={() => componentRef.current}
          onBeforeGetContent={() => {
            const qrcodeLogo = document.getElementById("react-qrcode-logo")
            if (qrcodeLogo) {
              qrcodeLogo.style.height = "1000px"
              qrcodeLogo.style.width = "1000px"
            }
          }}
        />
      </Row>
    </>
  )
}