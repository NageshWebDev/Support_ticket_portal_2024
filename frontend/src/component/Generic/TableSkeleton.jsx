import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";

export default function TableSkeleton() {
  return (
    <section className="formStyle h-[475px] flex flex-col justify-between">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-200">
            {[1, 2, 3, 4, 5, 6].map((heading) => (
              <th className="genericThead" key={heading}>
                <span className="skeletonTd !w-20 !bg-gray-300"></span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 4, 5].map((data) => {
            return (
              <tr className="border-t" key={data}>
                <td className="genericTbody">
                  <span className="skeletonTd !w-4"></span>
                </td>
                <td className="genericTbody">
                  <span className="skeletonTd"></span>
                </td>
                <td className="genericTbody">
                  <span className="skeletonTd !w-20"></span>
                </td>
                <td className="genericTbody">
                  <span className="skeletonTd !w-14"></span>
                </td>
                <td className="genericTbody">
                  <span className="skeletonTd !w-24"></span>
                </td>
                <td className="genericTbody">
                  <span className="skeletonTd !rounded-full !w-16"></span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-center p-2 rounded-md animate-pulse">
        <div className="flex items-center justify-between text-gray-500 bg-gray-200 rounded-full gap-5 p-1 w-44">
          <button>
            <ChevronLeftIcon className="size-5 cursor-not-allowed text-gray-400" />
          </button>
          <button>
            <ChevronRightIcon className="size-5 cursor-not-allowed text-gray-400" />
          </button>
        </div>
      </div>
    </section>
  );
}
