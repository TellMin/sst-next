export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>SST Auth</h1>
      <div>
        <a
          href={`${process.env.NEXT_PUBLIC_APP_API_URL}/auth/google/authorize`}
          rel="noreferrer"
        >
          <button>Sign in with Google</button>
        </a>
      </div>
    </main>
  );
}
