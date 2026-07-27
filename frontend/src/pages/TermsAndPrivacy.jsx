import { ArrowLeft, FileText, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const LAST_UPDATED = "July 26, 2026";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: [
      "By creating an account, accessing, or using TaskFlow, you agree to these Terms of Service and this Privacy Policy.",
      "If you do not agree with these terms, you should not use the application.",
    ],
  },
  {
    id: "service",
    title: "2. About TaskFlow",
    content: [
      "TaskFlow is a collaborative task-management application that allows users to create teams, assign tasks, manage deadlines, publish announcements, and review team progress.",
      "TaskFlow is currently provided as a portfolio, educational, and demonstration project. Features may be changed, suspended, or removed as the application evolves.",
    ],
  },
  {
    id: "accounts",
    title: "3. User Accounts",
    content: [
      "You are responsible for providing accurate account information and keeping your login credentials secure.",
      "You are responsible for activity performed through your account unless you notify us about unauthorized access.",
      "You must not share passwords, impersonate another person, or attempt to access accounts that do not belong to you.",
    ],
  },
  {
    id: "acceptable-use",
    title: "4. Acceptable Use",
    content: [
      "You may use TaskFlow only for lawful and legitimate collaboration purposes.",
      "You must not upload harmful content, attempt to damage the application, bypass permissions, scrape private information, distribute malware, or interfere with other users.",
      "Accounts may be restricted or removed when they are used in a way that threatens the security, availability, or integrity of TaskFlow.",
    ],
  },
  {
    id: "roles",
    title: "5. Teams, Roles, and Permissions",
    content: [
      "TaskFlow supports owner, admin, member, and viewer roles. The actions available to each user depend on the role assigned within a team.",
      "Team owners and administrators are responsible for managing memberships and assigning appropriate access.",
      "TaskFlow is not responsible for actions taken by users who were granted elevated permissions by a team owner or administrator.",
    ],
  },
  {
    id: "content",
    title: "6. User Content",
    content: [
      "You retain responsibility for the tasks, announcements, descriptions, names, and other information you submit to TaskFlow.",
      "You should not submit confidential, illegal, copyrighted, or sensitive information unless you are authorized to store and share it.",
      "By submitting content, you allow TaskFlow to store and process it only as needed to provide the application's functionality.",
    ],
  },
  {
    id: "availability",
    title: "7. Service Availability",
    content: [
      "TaskFlow may occasionally be unavailable because of maintenance, deployment, hosting limitations, network issues, or third-party service interruptions.",
      "We do not guarantee uninterrupted availability, permanent data storage, or error-free operation.",
      "You should keep independent copies of any information that is important to you.",
    ],
  },
  {
    id: "data-collected",
    title: "8. Information We Collect",
    content: [
      "TaskFlow may collect account information such as your name, email address, encrypted password, team memberships, assigned roles, tasks, announcements, and application activity.",
      "Technical information such as IP address, browser type, device information, request logs, and error details may be processed by the application or its hosting providers.",
      "Passwords should be stored using one-way hashing and are not intended to be stored as readable plain text.",
    ],
  },
  {
    id: "data-use",
    title: "9. How Information Is Used",
    content: [
      "Information is used to authenticate users, provide team collaboration features, enforce permissions, display tasks, generate analytics, maintain security, and troubleshoot technical problems.",
      "TaskFlow does not sell personal information to advertisers.",
      "Information will not be used for unrelated marketing unless explicit consent is obtained.",
    ],
  },
  {
    id: "storage",
    title: "10. Data Storage and Security",
    content: [
      "TaskFlow may use third-party hosting, database, deployment, email, or analytics services to operate the application.",
      "Reasonable technical safeguards may include password hashing, authentication tokens, access controls, HTTPS, database permissions, and server-side validation.",
      "No internet-based service can guarantee absolute security. You use TaskFlow with the understanding that security incidents and data loss remain possible.",
    ],
  },
  {
    id: "cookies",
    title: "11. Cookies and Local Storage",
    content: [
      "TaskFlow may use browser storage, authentication tokens, or similar technologies to keep users signed in and maintain application preferences.",
      "Removing stored authentication information may sign you out of the application.",
      "Where legally required, additional consent may be requested before using non-essential analytics or tracking technologies.",
    ],
  },
  {
    id: "sharing",
    title: "12. Information Sharing",
    content: [
      "Information may be processed by infrastructure providers that help host, secure, deploy, monitor, or operate TaskFlow.",
      "Information may also be disclosed when reasonably required to comply with law, protect users, investigate abuse, or defend the application's rights.",
      "TaskFlow does not intentionally disclose private team data to unrelated third parties.",
    ],
  },
  {
    id: "retention",
    title: "13. Data Retention and Deletion",
    content: [
      "Account and workspace information may be retained while your account remains active or while it is needed to provide the service.",
      "You may request deletion of your account or personal information by contacting the project owner.",
      "Some limited information may remain temporarily in backups, logs, or security records after deletion.",
    ],
  },
  {
    id: "children",
    title: "14. Children's Privacy",
    content: [
      "TaskFlow is not intentionally designed to collect personal information from children below the minimum age required by applicable law.",
      "If you believe a child has provided personal information without proper authorization, contact the project owner so the information can be reviewed and removed.",
    ],
  },
  {
    id: "liability",
    title: "15. Disclaimer and Limitation of Liability",
    content: [
      'TaskFlow is provided on an "as is" and "as available" basis without warranties of uninterrupted operation, fitness for a particular purpose, or permanent data availability.',
      "To the maximum extent permitted by applicable law, the project owner will not be liable for indirect losses, missed deadlines, deleted tasks, lost data, service interruptions, or decisions made using the application.",
    ],
  },
  {
    id: "termination",
    title: "16. Account Suspension and Termination",
    content: [
      "Access may be suspended or terminated when a user violates these terms, threatens application security, abuses other users, or uses TaskFlow unlawfully.",
      "You may stop using TaskFlow at any time and may request account deletion.",
    ],
  },
  {
    id: "changes",
    title: "17. Changes to These Terms",
    content: [
      "These terms may be updated when TaskFlow introduces new features, changes its infrastructure, or needs to address legal or security requirements.",
      "The updated date shown at the top of this page will indicate the latest revision.",
      "Continued use after an update means you accept the revised terms.",
    ],
  },
  {
    id: "contact",
    title: "18. Contact",
    content: [
      "For privacy questions, account deletion requests, security reports, or concerns about these terms, contact:",
      "Email: taskflow0noreply@gmail.com",
    ],
  },
];

export default function TermsAndPrivacy() {
  return (
    <div className="min-h-screen bg-[#07090d] text-white selection:bg-emerald-300 selection:text-zinc-950">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07090d]/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-300 text-xs font-bold text-zinc-950">
              TF
            </div>

            <span className="text-lg font-semibold tracking-[-0.02em]">
              TaskFlow
            </span>
          </Link>

          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/[0.07] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
        <section className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-3 py-1.5 text-sm text-emerald-200">
            <ShieldCheck className="h-4 w-4" />
            Legal and privacy information
          </div>

          <h1 className="mt-6 text-4xl font-[650] tracking-[-0.035em] sm:text-6xl">
            Terms of Service
            <span className="block text-zinc-500">& Privacy Policy</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
            This page explains the rules for using TaskFlow and how account,
            workspace, and technical information may be handled.
          </p>

          <p className="mt-4 text-sm text-zinc-500">
            Last updated: {LAST_UPDATED}
          </p>
        </section>

        <div className="mt-12 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
              <p className="mb-3 px-2 text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">
                On this page
              </p>

              <nav className="max-h-[70vh] space-y-1 overflow-y-auto pr-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block rounded-lg px-2 py-2 text-sm text-zinc-500 transition-colors hover:bg-white/4 hover:text-zinc-200"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <InfoCard
                icon={FileText}
                title="Terms"
                description="Rules for accessing and using TaskFlow."
              />

              <InfoCard
                icon={LockKeyhole}
                title="Privacy"
                description="How account and workspace data may be processed."
              />

              <InfoCard
                icon={ShieldCheck}
                title="Security"
                description="Responsibilities and limitations around security."
              />
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              {sections.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  className={`scroll-mt-24 p-6 sm:p-8 ${
                    index !== sections.length - 1
                      ? "border-b border-white/[0.07]"
                      : ""
                  }`}
                >
                  <h2 className="text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">
                    {section.title}
                  </h2>

                  <div className="mt-4 space-y-3">
                    {section.content.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-sm leading-7 text-zinc-400 sm:text-base"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-amber-300/15 bg-amber-300/[0.04] p-5">
              <p className="text-sm leading-6 text-amber-100/80">
                TaskFlow is currently a portfolio and demonstration project. Do
                not store highly sensitive, regulated, financial, medical, or
                confidential business information unless the application has
                been reviewed and configured for that purpose.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 px-5 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} TaskFlow.</p>

          <div className="flex items-center gap-4">
            <Link to="/signin" className="hover:text-zinc-300">
              Sign in
            </Link>

            <Link to="/signup" className="hover:text-zinc-300">
              Create account
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function InfoCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-300/15 bg-emerald-300/[0.07] text-emerald-300">
        <Icon className="h-4 w-4" />
      </div>

      <h2 className="mt-4 text-sm font-semibold text-white">{title}</h2>

      <p className="mt-1 text-xs leading-5 text-zinc-500">{description}</p>
    </div>
  );
}
