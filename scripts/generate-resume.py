#!/usr/bin/env python3
"""Rebuild the public one-page resume: python scripts/generate-resume.py.

Requires reportlab and Times New Roman or Liberation Serif fonts. Fonts are
embedded so the downloaded PDF keeps its appearance on every device.
The current-role facts and dates match data/data.js. Historical details and
education are preserved from the original public PDF.
"""

from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


OUTPUT = Path(__file__).resolve().parents[1] / "public/resume/Yang Si Jun Resume.pdf"
PAGE_WIDTH, PAGE_HEIGHT = letter
MARGIN = 36
CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN

EXPERIENCE = [
    (
        "ByteDance", "Singapore", "Software Engineer (SRE)", "Jul 2026 - Present",
        [
            "Build distributed storage tooling (HBase, ByteKV, TokaDB) for storage expansion from utilization alerts, machine replacement, configuration management, infrastructure tracking, and admin CLI usability.",
            "Investigate partition and replica-group issues with Grafana, shell tools, jump servers, and Go/Python code, drawing on Raft and RocksDB concepts.",
        ],
    ),
    (
        "Tangled Social", "Singapore", "Co-founder & Software Engineer", "Jul 2025 - Present",
        [
            "Co-founded a live App Store social platform with 4k+ users and built the majority of the codebase.",
            "Built real-time chat with AWS WebSocket Gateway, Lambda, and DynamoDB. Provisioned infrastructure with Terraform and implemented monitoring and reliability features.",
        ],
    ),
    (
        "ByteDance", "Singapore", "Software Engineer (SRE) Intern", "Sep 2025 - Dec 2025",
        [
            "Monitored ByteGraph through on-call responsibilities and machine operations for production clusters in Singapore and Europe.",
            "Built warning-indicator exports with automatically calculated storage, read, and QPS quotas for system stability.",
            "Built a Cloud Platform dashboard tracking machine counts across models, cluster namespaces, and DCs to support faster provisioning and migration.",
        ],
    ),
    (
        "Taiwan Semiconductor Manufacturing Company (TSMC)", "Taiwan, Hsinchu",
        "Software Engineer (DevOps) Intern", "June 2025 - Aug 2025",
        [
            "Integrated OpenTelemetry tracing with Spring Boot Starter across 10+ fabrication labs and was first on the team to enable context propagation for NATS-driven systems.",
            "Auto-generated test scenarios with Grafana Tempo to expand and track SIT coverage, eliminating manual system testing and saving developer time.",
            "Built auto sanity checks with Prometheus metrics to strengthen service reliability and deployment confidence across all fabrication labs.",
        ],
    ),
    (
        "Changi Airport Group", "Singapore", "Software Engineer Intern", "Jan 2025 - May 2025",
        [
            "Built a production event-driven serverless Slack bot to automate and mobile-enable flight operations workflows, reducing average query resolution time by 80%.",
            "Centralized CloudWatch log extraction across AWS accounts, parallelising export jobs to overcome the 10k log export limit.",
            "Built and deployed two internal production microservices that read flight data from the production database for airport operations.",
        ],
    ),
    (
        "Reluvate Technologies", "Singapore", "Software Engineer Intern", "Feb 2022 - Jul 2022",
        [
            "Built core Django merchant admin portal backend features with rigorous unit testing, ensuring scalability for 4,000+ merchants including KOI, Watsons, and Zara.",
            "Developed a company-wide testing SOP and served as the go-to person for Django unit-testing questions.",
        ],
    ),
]

PROJECTS = [
    (
        '<b>PlantPulse</b> | <i>Dell Cloud and IoT Project Award Finalist</i> | '
        '<a href="https://github.com/zedithx/Cloud-Iot-Infra"><i>GitHub</i></a>',
        [
            "Designed cloud infrastructure for an IoT Plant Monitoring Device to detect disease rates, humidity, moisture, and temperature.",
            "Used AWS CDK for IoT Core, Lambda, DynamoDB, EventBridge, SNS, SES, S3, and SageMaker Batch Transform infrastructure.",
        ],
    ),
    (
        "<b>ROOTech - Student Government</b>",
        [
            "Independently built event webpages serving 1,600 students: Orientation 2023, Night Fiesta 2023, and LCC 2024.",
            "Led custom RFID band integration and built a Django Game Booth Carnival System with real-time leaderboard, JWT authentication, and role-based API access controls.",
            "Built an AI chatbot with event pass generation for Open House 2025 registration, serving 1.8k users over 2 days.",
        ],
    ),
]


def register_fonts():
    families = [
        (
            Path("/System/Library/Fonts/Supplemental"),
            ["Times New Roman.ttf", "Times New Roman Bold.ttf",
             "Times New Roman Italic.ttf", "Times New Roman Bold Italic.ttf"],
        ),
        (
            Path("/usr/share/fonts/truetype/msttcorefonts"),
            ["times.ttf", "timesbd.ttf", "timesi.ttf", "timesbi.ttf"],
        ),
        (
            Path("/usr/share/fonts/truetype/liberation2"),
            ["LiberationSerif-Regular.ttf", "LiberationSerif-Bold.ttf",
             "LiberationSerif-Italic.ttf", "LiberationSerif-BoldItalic.ttf"],
        ),
        (
            Path.home() / ".cache/codex-runtimes/codex-primary-runtime/dependencies/native/"
            "libreoffice-headless/libreoffice/LibreOfficeDev.app/Contents/Resources/fonts/truetype",
            ["LiberationSerif-Regular.ttf", "LiberationSerif-Bold.ttf",
             "LiberationSerif-Italic.ttf", "LiberationSerif-BoldItalic.ttf"],
        ),
    ]
    names = ["ResumeSerif", "ResumeSerif-Bold", "ResumeSerif-Italic", "ResumeSerif-BoldItalic"]
    for directory, files in families:
        if all((directory / file).is_file() for file in files):
            for name, file in zip(names, files):
                pdfmetrics.registerFont(TTFont(name, str(directory / file)))
            pdfmetrics.registerFontFamily(
                "ResumeSerif", normal=names[0], bold=names[1],
                italic=names[2], boldItalic=names[3],
            )
            return
    raise FileNotFoundError("Install Times New Roman or Liberation Serif to embed the resume's serif fonts.")


def generate_resume():
    register_fonts()
    pdf = canvas.Canvas(str(OUTPUT), pagesize=letter, pageCompression=1, invariant=1)
    pdf.setTitle("Yang Si Jun - Resume")
    pdf.setAuthor("Yang Si Jun")
    pdf.setSubject("Software Engineer (SRE), ByteDance, Co-founder, Tangled Social")
    pdf.setFillColor(colors.black)
    y = PAGE_HEIGHT - 31
    body_style = ParagraphStyle(
        "body", fontName="ResumeSerif", fontSize=9.8, leading=10.6,
        textColor=colors.black, spaceBefore=0, spaceAfter=0,
    )
    contact_style = ParagraphStyle(
        "contact", parent=body_style, fontSize=9.8, leading=11.5, alignment=TA_CENTER,
    )
    project_style = ParagraphStyle(
        "project", parent=body_style, fontSize=10.3, leading=11.6,
    )

    def paragraph(text, *, x=MARGIN, width=CONTENT_WIDTH, style=body_style):
        nonlocal y
        item = Paragraph(text, style)
        _, height = item.wrap(width, PAGE_HEIGHT)
        if y - height < 28:
            raise ValueError(f"Resume content ends at {y - height:.1f}pt; condense before publishing.")
        item.drawOn(pdf, x, y - height)
        y -= height

    def section(title):
        nonlocal y
        y -= 5
        pdf.setFont("ResumeSerif", 12)
        pdf.drawString(MARGIN, y - 11, title.upper())
        y -= 15
        pdf.setLineWidth(0.45)
        pdf.line(MARGIN, y, PAGE_WIDTH - MARGIN, y)
        y -= 5

    def heading(left, right, *, font="ResumeSerif-Bold", size=10.8, height=12.4):
        nonlocal y
        # Keep long company names separate from locations, as in the original.
        pdf.setFont(font, size)
        right_width = pdf.stringWidth(right, font, size)
        left_width = pdf.stringWidth(left, font, size)
        if right and left_width + right_width + 12 > CONTENT_WIDTH:
            raise ValueError(f"Heading overlaps its location/date: {left}")
        pdf.drawString(MARGIN + 3, y - size, left)
        pdf.drawRightString(PAGE_WIDTH - MARGIN - 3, y - size, right)
        y -= height

    def bullets(items):
        nonlocal y
        for text in items:
            pdf.setFont("ResumeSerif", 9.8)
            pdf.drawString(MARGIN + 4, y - 9.2, "\u2022")
            paragraph(escape(text), x=MARGIN + 14, width=CONTENT_WIDTH - 17)
            y -= 1

    pdf.setFont("ResumeSerif-Bold", 26)
    pdf.drawCentredString(PAGE_WIDTH / 2, y - 25, "Yang Si Jun")
    y -= 31
    paragraph(
        '83055237 | <a href="mailto:aersijun@gmail.com">aersijun@gmail.com</a> | '
        '<a href="https://linkedin.com/in/yang-si-jun">linkedin.com/in/yang-si-jun</a> | '
        '<a href="https://github.com/zedithx">github.com/zedithx</a> | '
        '<a href="https://zedithx.com">zedithx.com</a>',
        style=contact_style,
    )
    y -= 3

    section("Experience")
    for company, location, role, dates, items in EXPERIENCE:
        heading(company, location)
        heading(role, dates, font="ResumeSerif-Italic", size=10.1, height=11.4)
        bullets(items)
        y -= 3

    section("Projects")
    for title, items in PROJECTS:
        paragraph(title, x=MARGIN + 3, width=CONTENT_WIDTH - 6, style=project_style)
        bullets(items)
        y -= 3

    section("Education")
    heading("Singapore University Of Technology And Design (SUTD)", "Singapore")
    heading("Bachelor's, Computer Science and Design", "Aug 2022 - May 2026",
            font="ResumeSerif-Italic", size=10.1, height=11.4)

    section("Technical Skills")
    paragraph("<b>Languages:</b> Python, Golang, Ruby, Javascript, TypeScript, Java, HTML/CSS, SQL",
              x=MARGIN + 10, width=CONTENT_WIDTH - 10)
    paragraph("<b>Frameworks:</b> Django, Flask, FastAPI, Ruby on Rails, Spring Boot, NextJS, ReactJS, React Native/Expo",
              x=MARGIN + 10, width=CONTENT_WIDTH - 10)
    paragraph("<b>Developer Tools:</b> AWS, GCP, Azure Cloud, Kubernetes, Helm, Terraform, Sentry, Cypress, Grafana, Github Actions",
              x=MARGIN + 10, width=CONTENT_WIDTH - 10)
    pdf.showPage()
    pdf.save()
    print(f"Wrote one-page resume: {OUTPUT} (content ends {y:.1f}pt from bottom)")


if __name__ == "__main__":
    generate_resume()
