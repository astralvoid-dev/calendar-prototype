"use client"

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Temporal } from "@js-temporal/polyfill";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogFooter, DialogHeader } from "./ui/dialog";

export default function Calendar(){
    const [month, setMonth] = useState(Temporal.Now.plainDateISO().month);
    const [year, setYear] = useState(Temporal.Now.plainDateISO().year);
    const [monthCalendar, setMonthCalendar] = useState<{ date: Temporal.PlainDate; isInMonth: boolean}[]>([])

    useEffect(() => {
        const fiveWeeks = 5 * 7;
        const sixWeeks = 6 * 7;
        const startOfMonth = Temporal.PlainDate.from({ year, month, day: 1 });
        const monthLength = startOfMonth.daysInMonth;
        const dayOfWeekMonthStartedOn = startOfMonth.dayOfWeek - 1;

        // Calculate the overall length including days from the previous and next months to be shown
        const length = dayOfWeekMonthStartedOn + monthLength > fiveWeeks ? sixWeeks : fiveWeeks;

        const calendar = new Array(length)
        .fill({})
        .map((_, index) => {
            const date = startOfMonth.add({
                days: index - dayOfWeekMonthStartedOn
            });
            return {
                isInMonth: !(
                    index < dayOfWeekMonthStartedOn ||
                    index - dayOfWeekMonthStartedOn >= monthLength
                ),
                date
            }
        });

        setMonthCalendar(calendar);
    }, [year, month]);

    const onPreviousPressed = () => {
        const { month: previousMonth, year: previousYear } = Temporal.PlainYearMonth.from({
            month,
            year
        }).subtract({months: 1});
        setMonth(previousMonth);
        setYear(previousYear);
    };

    const onNextPressed = () => {
        const { month: nextMonth, year: nextYear } = Temporal.PlainYearMonth.from({
            month,
            year
        }).add({months: 1});
        setMonth(nextMonth);
        setYear(nextYear);
    };

    return(
        <div>
            <h2 className="text-lg font-semibold">
                {Temporal.PlainDate.from({year, month, day: 1}).toLocaleString("de", {
                    month: "long",
                    year: "numeric"
                })}
            </h2>
            <Button onClick={onPreviousPressed}>
                Previous
            </Button>
            <Button onClick={onNextPressed}>
                Next
            </Button>
            <Dialog>
                <form>
                    <DialogTrigger asChild>
                        <Button>Neue Termin</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Termin erstellen</DialogTitle>
                            <DialogDescription>
                                Beispiel
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button>Cancel</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
            <div className="grid grid-cols-7">
                {["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"].map(
                    (name, index) => (<div key={index}>{name}</div>)
                )}
            </div>
            <div className="grid grid-cols-7 flex-grow">
                {monthCalendar.map((day, index) => (
                    <div
                    key={index}
                    className={`border border-slate-700 p-2 ${
                        day.isInMonth
                        ? "bg-white hover:bg-gray-400"
                        : "bg-slate-300 hover:bg-slate-600 font-light text-slate-500"
                    }`}
                    >
                        {day.date.day}
                    </div>
                ))}
            </div>
        </div>
    );
}