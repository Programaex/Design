import datetime as dt
FERIADOS={dt.date(2026,11,2):"Finados",dt.date(2026,11,20):"Consciência Negra",dt.date(2026,12,25):"Natal",dt.date(2027,1,1):"Confraternização Universal",dt.date(2027,3,26):"Sexta-feira Santa",dt.date(2027,4,21):"Tiradentes"}
def p(s): d,m,a=s.split("/"); return dt.date(int(a),int(m),int(d))
def f(d): return d.strftime("%d/%m/%Y")
def horas_dia(d):
    w=d.weekday()
    return 8 if w<5 else (4 if w==5 else 0)
def dias(a,b):
    d=a
    while d<=b:
        yield d; d+=dt.timedelta(1)
def util(d): return horas_dia(d)>0 and d not in FERIADOS
def cap(a,b):
    nom=sum(horas_dia(d) for d in dias(a,b)); ind=sum(horas_dia(d) for d in dias(a,b) if d in FERIADOS)
    disp=nom-ind; ov=round(disp*0.10,1); E=round((disp-ov)/1.15,1); C=round(E*0.15,1)
    return dict(nom=nom,ind=ind,disp=disp,ov=ov,E=E,C=C,aloc=round(E+C,1))
def carga(T,a,b):
    tot=0.0
    for t in T:
        ini=p(t["ini"]); fim=p(t["janela"][1]) if t["prazo"]=="TBD" else p(t["prazo"])
        uds=[d for d in dias(ini,fim) if util(d)] or [ini]
        w=sum(horas_dia(d) for d in uds) or 1
        tot+=t["h"]*sum(horas_dia(d) for d in uds if a<=d<=b)/w if any(util(d) for d in dias(ini,fim)) else (t["h"] if a<=ini<=b else 0)
    return round(tot,1)
JANELAS=[("J1","Produção e agendamento do EPIC 01","17/10/2026","04/11/2026"),
         ("J2","Lançamento e ciclo 1","05/11/2026","14/11/2026"),
         ("J3","Produção da campanha 02 e início do épico de emprego","15/11/2026","30/11/2026"),
         ("J4","App, épicos posteriores e lançamento de 05/01","01/12/2026","05/01/2027"),
         ("J5","Certificações, portfólio e candidaturas","06/01/2027","30/03/2027"),
         ("J6","Preparação da viagem","31/03/2027","30/04/2027")]
