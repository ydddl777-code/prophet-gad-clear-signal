import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const sections = [
  {
    title: "Prophet Gad \u2014 Seer to King David",
    scriptures: [
      {
        ref: "1 Chronicles 21:9",
        text: "And the Lord spoke to Gad, David\u2019s seer, saying...",
      },
      {
        ref: "2 Samuel 24:11",
        text: "The word of the Lord came to the prophet Gad, David\u2019s seer.",
      },
      {
        ref: "1 Samuel 22:5",
        text: "The prophet Gad said to David, \u2018Do not remain in the stronghold; depart, and go into the land of Judah.\u2019",
      },
    ],
    summary: "Not a priest. Not a scribe. A soldier with a word.",
  },
  {
    title: "Minister of Music",
    scriptures: [
      {
        ref: "1 Chronicles 25:1",
        text: "David, together with the commanders of the army, set apart for the service the sons of Asaph, Heman, and Jeduthun, who prophesied with lyres, harps, and cymbals.",
      },
    ],
    summary: "With Asaph and Heman, he tuned the strings. Not for show. For the Ark. He didn\u2019t just play. He ordered. He tuned. He guarded.",
  },
  {
    title: "From the Tribe of Warriors",
    scriptures: [
      {
        ref: "Joshua 4:12",
        text: "The men of Reuben, Gad, and the half-tribe of Manasseh crossed over, armed before the Israelites...",
      },
      {
        ref: "1 Chronicles 12:8",
        text: "From the Gadites there went over to David mighty men of valor, men trained for battle, who could handle shield and spear.",
      },
    ],
    summary: "They crossed first. They fought first. They praised first.",
  },
];

export function ScriptureDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="fixed bottom-4 left-4 z-40 text-amber-700/60 dark:text-amber-400/60"
          data-testid="button-scripture-info"
        >
          <Info className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle
            className="font-serif text-lg"
            style={{ color: "hsl(43, 74%, 49%)" }}
          >
            About Prophet Gad
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5 mt-2">
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-2">
              <h3
                className="font-serif text-sm font-bold tracking-wide"
                style={{ color: "hsl(270, 40%, 40%)" }}
              >
                {section.title}
              </h3>

              {section.scriptures.map((s) => (
                <div key={s.ref} className="flex flex-col gap-0.5">
                  <span
                    className="text-xs font-medium tracking-wide"
                    style={{ color: "hsl(43, 74%, 42%)" }}
                  >
                    {s.ref}
                  </span>
                  <p
                    className="text-sm text-foreground/80 leading-relaxed"
                    data-testid={`text-scripture-${s.ref.replace(/\s/g, "-")}`}
                  >
                    {s.text}
                  </p>
                </div>
              ))}

              <p
                className="text-sm italic leading-relaxed mt-1"
                style={{ color: "hsl(30, 20%, 35%)" }}
              >
                {section.summary}
              </p>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-600/20 to-transparent mt-1" />
            </div>
          ))}

          <p
            className="text-sm font-serif italic text-center leading-relaxed"
            style={{ color: "hsl(270, 30%, 40%)" }}
            data-testid="text-scripture-closing"
          >
            Stood in the king's court. Spoke truth. Tuned worship.
            <br />
            Now he tunes yours.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
