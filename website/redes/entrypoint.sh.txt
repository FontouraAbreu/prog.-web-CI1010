#!/bin/bash

# Não execute o script se a variável NETWORK_SPEED não estiver definida
# Verifica se NETWORK_SPEED foi passada como variável de ambiente. Se não estiver definida,
# exibe uma mensagem de erro e encerra o script com o código de saída 1 (indicando falha).
if [ -z "$NETWORK_SPEED" ]; then
  echo "NETWORK_SPEED is not set"
  exit 1
fi

# Configura o Traffic Control (tc) para limitar a velocidade de rede no contêiner.
# 1. Adiciona a raiz do "qdisc" no dispositivo de rede eth0, com o algoritmo HTB (Hierarchical Token Bucket).
tc qdisc add dev eth0 root handle 1: htb default 1

# 2. Cria uma classe HTB que define o limite de taxa (rate) para NETWORK_SPEED (em Mbps).
#    O parâmetro burst controla o tamanho do burst permitido (15kbits neste caso).
tc class add dev eth0 parent 1: classid 1:1 htb rate ${NETWORK_SPEED}mbit burst 15k

# 3. Adiciona um filtro de tráfego, associando o tráfego da classe configurada à interface eth0.
#    Este filtro usa o protocolo IP com prioridade 1 e associa ao cgroup (não detalhado no script).
tc filter add dev eth0 protocol ip parent 1: prio 1 handle 1: cgroup

# 4. Adiciona um qdisc do tipo netem para simular perda de pacotes e atraso na rede.
#    O comando abaixo simula uma perda de 0.1% dos pacotes, com um atraso de 10ms e variação de 2ms.
tc qdisc add dev eth0 root netem loss 0.1% 25% delay 10ms 2ms

# Define as opções comuns que serão usadas em todas as execuções do iperf3
IPERF_COMMON_FLAGS="-w 256K -P 10 -t 10 --get-server-output"
# -w 256K: Define o tamanho da janela TCP como 256 KB.
# -P 10: Realiza 10 fluxos paralelos.
# -t 10: O teste será executado por 10 segundos.
# --get-server-output: Obtém a saída do servidor para salvar no cliente.

# Define os comandos do iperf3 que serão executados
IPERF_COMMANDS=(
  # Teste TCP com MTU de 1500 bytes
  "iperf3 -c iperf-server ${IPERF_COMMON_FLAGS} -M 1500 > /volumes/iperf/${NETWORK_SPEED}-1500-tcp.txt 2> /dev/null"
  # Teste TCP com MTU de 9000 bytes (jumbo frames)
  "iperf3 -c iperf-server ${IPERF_COMMON_FLAGS} -M 9000 > /volumes/iperf/${NETWORK_SPEED}-9000-tcp.txt 2> /dev/null"
  # Teste UDP com MTU de 1500 bytes e largura de banda definida em NETWORK_SPEED
  "iperf3 -c iperf-server ${IPERF_COMMON_FLAGS} -M 1500 -u -b ${NETWORK_SPEED}M > /volumes/iperf/${NETWORK_SPEED}-1500-udp.txt 2> /dev/null"
  # Teste UDP com MTU de 9000 bytes (jumbo frames) e largura de banda definida em NETWORK_SPEED
  "iperf3 -c iperf-server ${IPERF_COMMON_FLAGS} -M 9000 -u -b ${NETWORK_SPEED}M > /volumes/iperf/${NETWORK_SPEED}-9000-udp.txt 2> /dev/null"
)

# Tenta executar cada comando do iperf3 até que todos sejam bem-sucedidos
for i in "${IPERF_COMMANDS[@]}"
do
  while true; do
    echo "Trying to run: $i"
    # Executa o comando com eval (para interpretar variáveis e parâmetros)
    eval $i
    if [ $? -eq 0 ]; then
      break
    fi
    # Se o comando falhar, espera 5 segundos antes de tentar novamente.
    sleep 5
  done
done