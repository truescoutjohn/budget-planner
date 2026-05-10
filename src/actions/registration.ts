const registration = async (
  email: string,
  password: string,
  confirmPassword: string,
) => {
  const response = await fetch("/api/registration", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      passwordConfirmation: confirmPassword,
      confirmPassword,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
};

export default registration;
