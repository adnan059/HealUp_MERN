import { useNavigate, useSearchParams } from "react-router-dom";

export const useTableUrlState = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const get = (key: string, defaultValue: any) =>
    searchParams.get(key) ?? defaultValue;

  const set = (params: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === "") newParams.delete(k);
      else newParams.set(k, v);
    });

    navigate(`?${newParams.toString()}`, { replace: true });
  };

  return { get, set };
};
